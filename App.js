/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	Alert,
	Button,
	Platform,
	StyleSheet,
	// Platform,
	Text,
	View
} from 'react-native';


import firebase from 'react-native-firebase';

export default class App extends Component {

	constructor(props) {
		super(props);

		this.state = {token: '', payload: ''};
		this.fcm = firebase.messaging();
	}

	setup = () => {
		this.fcm.subscribeToTopic('foo');

		this.fcm.getInitialNotification()
			.then((payload) => {
				Alert.alert('getInitialNotification');
				console.log('getInitialNotification', payload);

				this.setState({payload});
			});

		this.fcm.onMessage((notif) => {
			Alert.alert('OnMessage');
			console.log('notif', notif);
			this.setState({payload: notif});
		});

	}

	componentDidMount() {
		if (Platform.OS === 'android') {
			return this.setup();
		}

		this.fcm.requestPermissions().then((res) => {
			console.log('permission', res);
			this.setup();

		}).catch((e) => (console.log('Error: ', e)));

	}

	componentWillUnmount() {
		this.fcm.unsubscribeFromTopic('foo');
	}

	register = () => {
		// firebase.messaging().requestPermissions();
	};

	getToken = () => {
		this.fcm.getToken().then((t) => {
			this.setState({token: t});
			console.log('TOKEN: ', t)
		});
	}

	createLocalNotification = () => {
		this.fcm.createLocalNotification({
			body: 'body',
			show_in_foreground: true,
			title: 'title',
			local_notification: true,
			priority: 'high'
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Welcome to React Native!
				</Text>
				<Button title="Register for push" onPress={this.register}/>
				<Button title="Get Token" onPress={this.getToken}/>
				<Text>{this.state.token}</Text>
				<Text>{JSON.stringify(this.state.payload)}</Text>
				<Button title="Local notification" onPress={this.createLocalNotification}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
