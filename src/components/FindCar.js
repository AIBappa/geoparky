import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

import supabase from "../config/supabaseClient";
import NavBar from "../components/Navbar";

import Button from "react-bootstrap/Button";

function Success(props) {
	// const [session, setSession] = useState(null);
	const [user, setUser] = useState({});
	const [mapUrl, setMapUrl] = useState(null);
	const [points, setPoints] = useState(null);
	const navigate = useNavigate();

	async function signOutUser() {
		// setSession(null);
		const logoutUser = props.token.user.email;

		const { error } = await supabase.auth.signOut();
		console.log(logoutUser);
		sessionStorage.removeItem("token");
		navigate("/login");
	}

	const addCar = (e, props) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			console.log("Geolocation not supported");
		}

		async function success(position) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			console.log(position);
			console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
			const { err } = await supabase.from("parking").insert({
				user_id: props.token.user.id,
				longitude: longitude,
				latitude: latitude,
				is_active: true,
			});

			fetch("http://localhost:8000/nearby/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					latitude: latitude,
					longitude: longitude,
				}),
			})
				.then((response) => response.json())
				.then((response) => {
					console.log(response);
					setPoints(response.points);
				})
				.catch((err) => {
					console.error(err);
				});

			if (err) {
				console.error(err);
			}
		}

		function error() {
			console.log("Unable to retrieve your location");
		}
	};

	const findCar = async (e, props) => {
		const { data, error } = await supabase
			.from("parking")
			.select()
			.eq("user_id", props.token.user.id)
			.eq("is_active", "true");
		if (data) {
			// console.log(data);
			const url = `https://maps.google.com/?q=${data[0].latitude},${data[0].longitude}`;
			setMapUrl(url);
		}
		if (error) {
			console.error(error);
		}
	};

	const deleteCar = async (e, props) => {
		const { data, error } = await supabase
			.from("parking")
			.update({ is_active: "false" })
			.eq("user_id", props.token.user.id)
			.eq("is_active", "true");
		if (data) {
			alert("Car found, removing from db.");
		}
		if (error) {
			console.error(error);
		}
	};

	return (
		<>
			<NavBar usermail={props.token.user.email}></NavBar>

			<div className="App">
				<header className="App-header">
					<Container>
						<p>This is the save and find car page</p>
						<Button
							variant="primary"
							className="primary"
							type="submit"
							onClick={(e) => addCar(e, props)}
						>
							Add Car
						</Button>
						<Button
							variant="primary"
							className="primary"
							type="submit"
							onClick={(e) => findCar(e, props)}
						>
							Find Car
						</Button>
						<Button
							variant="primary"
							className="primary"
							type="submit"
							onClick={(e) => deleteCar(e, props)}
						>
							Delete Car
						</Button>

						<br></br>
						<br></br>

						{points !== null ? (
							<p>
								There are {points} Danger zones within 1km
								radius of your parked area!
							</p>
						) : (
							<div></div>
						)}

						<br></br>
						<br></br>

						{mapUrl && (
							<iframe
								height="500px"
								width="500px"
								src={mapUrl}
							></iframe>
						)}
					</Container>
				</header>
			</div>
		</>
	);
}

export default Success;
