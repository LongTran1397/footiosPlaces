import React, { Component } from 'react';
import { View, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { addPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import validation from '../../utility/validation';
import { startAddPlace } from '../../store/actions';

class SharePlaceScreen extends Component {
	static navigatorStyle = {
		navBarButtonColor: 'orange'
	};

	constructor(props) {
		super(props);
		// setOnNavigatorEvent: here we specify a method that should be executed
		// every time an event occurs.
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	//WARNING! To be deprecated in React v17. Use componentDidMount instead.
	componentWillMount() {
		this.reset();
	}

	reset = () => {
		this.setState({
			controls: {
				placeName: {
					value: '',
					valid: false,
					touched: false,
					validationRules: {
						notEmpty: true
					}
				},
				location: {
					value: null,
					valid: false
				},
				image: {
					value: null,
					valid: false
				}
			}
		});
	};

	componentDidUpdate() {
		if (this.props.placeAdded) {
			this.props.navigator.switchToTab({ tabIndex: 0 });
		}
	}

	// above in the constructor, we don't need to bind.`this`
	// like this: this.onNavigatorEvent.bind(this)
	// because we use here an arrow func.
	onNavigatorEvent = (event) => {
		// console.log(event);
		if (event.type === 'ScreenChangedEvent') {
			if (event.id === 'willAppear') {
				this.props.onStartAddPlace();
			}
		}
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'sideDrawerToggle') {
				this.props.navigator.toggleDrawer({
					side: 'left'
				});
			}
		}
	};

	placeNameChangedHandler = (val) => {
		this.setState((prevState) => {
			return {
				controls: {
					...prevState.controls,
					placeName: {
						value: val,
						touched: true,
						valid: validation(val, prevState.controls.placeName.validationRules)
					}
				}
			};
		});
	};

	locationPickedHandler = (location) => {
		this.setState((prevState) => {
			return {
				controls: {
					...prevState.controls,
					location: {
						value: location,
						valid: true
					}
				}
			};
		});
	};

	imagePickedHandler = (image) => {
		this.setState((prevState) => {
			return {
				controls: {
					...prevState.controls,
					image: {
						value: image,
						valid: true
					}
				}
			};
		});
	};

	placeAddedHandler = () => {
		this.props.onAddPlace(
			this.state.controls.placeName.value,
			this.state.controls.location.value,
			this.state.controls.image.value
		);
		this.reset();
		this.imagePicker.reset();
		this.locationPicker.reset();
	};

	render() {
		let submitButton = (
			<Button
				disabled={
					!this.state.controls.placeName.valid ||
					!this.state.controls.location.valid ||
					!this.state.controls.image.valid
				}
				title="Share the Place"
				onPress={this.placeAddedHandler}
			/>
		);

		if (this.props.isLoading) {
			submitButton = <ActivityIndicator size="large" color="#0000ff" />;
		}

		return (
			<View behavior={'padding'} style={styles.container}>
				<KeyboardAwareScrollView>
					<View style={{ alignItems: 'center' }}>
						<MainText>
							<HeadingText>Share a place with us!</HeadingText>
						</MainText>
					</View>
					<View>
						<PickImage onImagePicked={this.imagePickedHandler} ref={(ref) => (this.imagePicker = ref)} />
						<PickLocation
							onLocationPick={this.locationPickedHandler}
							ref={(ref) => (this.locationPicker = ref)}
						/>
					</View>
					<View style={styles.placeInput}>
						<PlaceInput
							/* placeName has all the controls placeData is intrested in */
							placeData={this.state.controls.placeName}
							onChangeText={this.placeNameChangedHandler}
						/>
					</View>
					<View style={styles.button}>{submitButton}</View>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	button: {
		margin: 8,
		alignItems: 'center'
	},
	placeInput: {
		width: 300,
		alignItems: 'center'
	}
});
const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.isLoading,
		placeAdded: state.places.placeAdded
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
		onStartAddPlace: () => dispatch(startAddPlace())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
