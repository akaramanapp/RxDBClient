/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import schema from './src/Schema'
import * as RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-asyncstorage').default);


class App extends React.Component {

  constructor(props) {
    super(props)
    this.addData = this.addData.bind(this);
    this.subs = [];
    this.state = {
      todoItem: '',
      todoList: null
    }
  }

  async createDatabase() {
    const db = await RxDB.create({
      name: 'tododatabase',
      adapter: 'asyncstorage',
      multiInstance: false
    });
    await db.collection({
      name: 'todo',
      schema,
    });
    console.log(db)
    return db;
  }

  async componentDidMount() {
    this.db = await this.createDatabase();

    const sub = this.db.todo
      .find()
      .$.subscribe(data => {
        this.setState({
          todoList: data
        })
      });

      this.subs.push(sub);
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  async addData() {
    const description = this.state.todoItem
    const status = 'false'
    await this.db.todo.insert({ description, status });
    this.setState({todoItem: ''})
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View><TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => this.setState({ todoItem: text })}
          value={this.state.todoItem}
        />
          <Button
            title="Add Todo Item"
            onPress={() => this.addData()}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          {
            this.state.todoList ? this.state.todoList.map((item) => {
              return <Text key={item.description}>{ item.description }</Text>
            }) : null
          }      
        </View>
      </SafeAreaView>
    )
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
