import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../components/Navbar";
import Card from "react-bootstrap/Card";

import supabase from "../config/supabaseClient";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import "./ProfilePage.css";

const customIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/128/10742/10742692.png",
	iconSize: [38, 38],
});

const ProfilePage = (props) => {
	const [parking, setParking] = useState(null);

	useEffect(() => {
		const fetchParkings = async () => {
			const { data, error } = await supabase
				.from("parking")
				.select()
				.eq("user_id", props.token.user.id);
			if (data) {
				setParking(data);
			}
			if (error) {
				console.error(error);
			}
		};

		fetchParkings();
	}, []);

	return (
		<>
			<NavBar usermail={props.token.user.email}></NavBar>
			<div className="App">
				<div className="App-header">
					<Container>
						<h2>User Email: {props.token.user.email}</h2>
						<p>View User History and stored car locations</p>
						<Row>
							<Col md="12">
								<MapContainer
									center={[51.505, -0.09]}
									zoom={3}
									scrollWheelZoom={true}
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
									{parking &&
										parking.map((park) => {
											console.log(park);
											return (
												<Marker
													position={[
														park.latitude,
														park.longitude,
													]}
													icon={customIcon}
												>
													<Popup>
														Your car is present
														here. User: #
														{park.user_id}
													</Popup>
												</Marker>
											);
										})}
								</MapContainer>
							</Col>
						</Row>

						<br></br>
						<br></br>
						<br></br>

						<h3>Stored History</h3>

						<Row>
							{parking &&
								parking.map((park) => {
									return (
										<Col md="4">
											<Card className={`card-background`}>
                                                <Card.Title mt="2">
                                                    <h4>Location</h4>
												</Card.Title>
												<Card.Body>
													<Card.Text>
														<p>
															latitude:{" "}
															{park.latitude}
														</p>
													</Card.Text>
													<Card.Text>
														<p>
															longitude:{" "}
															{park.longitude}
														</p>
													</Card.Text>
													<Card.Text>
														<p>
															parked on:{" "}
															{park.created_at}
														</p>
													</Card.Text>
												</Card.Body>
											</Card>
										</Col>
									);
								})}
						</Row>
					</Container>

					<br></br>
					<br></br>
					<br></br>
					<br></br>
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
