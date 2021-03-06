import React, { Component } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

class PickLocation extends Component {
	// WARNING! To be deprecated in React v17. Use componentDidMount instead.
	// componentWillMount() {
	// 	this.reset();
	// }
	state = {
		focusedLocation: {
			latitude: 37.7900352,
			longitude: -122.4013726,
			latitudeDelta: 0.0122,
			longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
		},
		locationChosen: false
	};

	reset = () => {
		this.setState({
			focusedLocation: {
				latitude: 37.7900352,
				longitude: -122.4013726,
				latitudeDelta: 0.0122,
				longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
			},
			locationChosen: false
		});
	};

	pickLocationHandler = (event) => {
		const coords = event.nativeEvent.coordinate;
		this.map.animateToRegion(
			{
				...this.state.focusedLocation,
				latitude: coords.latitude,
				longitude: coords.longitude
			},
			1000
		); // duration is not needed!
		this.setState((prevState) => {
			return {
				focusedLocation: {
					...prevState.focusedLocation,
					latitude: coords.latitude,
					longitude: coords.longitude
				},
				locationChosen: true
			};
		});
		this.props.onLocationPick({
			latitude: coords.latitude,
			longitude: coords.longitude
		});
	};

	getLocationHandler = () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const coordsEvent = {
					nativeEvent: {
						coordinate: {
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude
						}
					}
				};
				this.pickLocationHandler(coordsEvent);
			},
			(err) => {
				console.log(err);
				alert('Fetching position failed. Please pick one manually.');
			}
		);
	};
	render() {
		let marker = null;

		if (this.state.locationChosen) {
			marker = <MapView.Marker coordinate={this.state.focusedLocation} title="marker" />;
		}
		return (
			<View style={{ alignItems: 'center' }}>
				<MapView
					initialRegion={this.state.focusedLocation}
					region={!this.state.locationChosen ? this.state.focusedLocation : null}
					style={styles.map}
					onPress={this.pickLocationHandler}
					ref={(ref) => (this.map = ref)}
				>
					{marker}
				</MapView>
				<View style={styles.button}>
					<Button title="Locate Me" onPress={this.getLocationHandler} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// width: '100%',
		// alignItems: 'center'
	},
	map: {
		width: '100%',
		height: 250
	},
	button: {
		margin: 8
	}
});

export default PickLocation;
