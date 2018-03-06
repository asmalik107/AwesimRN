/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	AppState,
	Alert,
	Button,
	Platform,
	StyleSheet,
	Switch,
	Text,
	View
} from 'react-native';
import Push from 'appcenter-push';

Push.setListener({
	onPushNotificationReceived: function (pushNotification) {
		let message = pushNotification.message;
		let title = pushNotification.title;

		if (message === null || message === undefined) {
			// Android messages received in the background don't include a message. On Android, that fact can be used to
			// check if the message was received in the background or foreground. For iOS the message is always present.
			title = 'Android background';
			message = '<empty>';
		}

		// Custom name/value pairs set in the App Center web portal are in customProperties
		if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
			message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
		}

		if (AppState.currentState === 'active') {
			Alert.alert(title, message);
		}
		else {
			// Sometimes the push callback is received shortly before the app is fully active in the foreground.
			// In this case you'll want to save off the notification info and wait until the app is fully shown
			// in the foreground before displaying any UI. You could use AppState.addEventListener to be notified
			// when the app is fully in the foreground.
		}
	}
});


export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {pushEnabled: false};
	}

	componentDidMount() {
		this.isPushEnabled();
	}

	async isPushEnabled() {
		const pushEnabled = await Push.isEnabled();
		this.setState({pushEnabled});
	}

	async enablePush() {
		const pushEnabled = !this.state.pushEnabled;
		await Push.setEnabled(pushEnabled);
		this.setState({pushEnabled});
	};

	register() {
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Push Notifications
				</Text>
				<Text>Push enabled: {this.state.pushEnabled ? 'yes' : 'no'}</Text>
				<Switch
					onValueChange={this.enablePush.bind(this)}
					value={this.state.pushEnabled}/>
				<Button title="Register for push" onPress={this.register.bind(this)}/>
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
	}
});
