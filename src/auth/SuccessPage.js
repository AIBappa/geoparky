import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

import supabase from "../config/supabaseClient";
import NavBar from "../components/Navbar";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SuccessPage.css";

const customIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/128/10742/10742692.png",
	iconSize: [38, 38],
});

function Success(props) {
	// const [session, setSession] = useState(null);
	const [user, setUser] = useState({});
	const [fetchError, setFetchError] = useState(null);
	const [parking, setParking] = useState(null);
	const navigate = useNavigate();

	async function signOutUser() {
		// setSession(null);
		const logoutUser = props.token.user.email;

		const { error } = await supabase.auth.signOut();
		console.log(logoutUser);
		sessionStorage.removeItem("token");
		navigate("/login");
	}

	useEffect(() => {
		const fetchParkings = async () => {
			const { data, error } = await supabase
				.from("parking")
				.select()
				.eq("is_active", "true");
			if (data) {
				// console.log(data);
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
								position={[park.latitude, park.longitude]}
								icon={customIcon}
							>
								<Popup>
									Your car is present here. User: #
									{park.user_id}
								</Popup>
							</Marker>
						);
					})}
			</MapContainer>
		</>
	);
}

export default Success;
