// * Components


import React, { useState, useEffect } from "react";
import {
    RangeDatePicker,
    SingleDatePicker
} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import Stack from '@mui/material/Stack';

import banner1 from "../assets/map.png";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    IconButton,
    Badge,
    Divider,
    Popover,
    List,
    ListItem,
    Container,
} from "@mui/material";
import { Person, ArrowDropDown, SyncAlt, FlightTakeoff } from "@mui/icons-material";
import axios from "axios";
import CustomButton from "./CustomButton";

// * Images
import buyIcon from "../media/buy_icon.png";
import sellIcon from "../media/sell_icon.png";
import rentIcon from "../media/rent_icon.png";

// * MUI Components
import { ArrowRightAlt } from "@mui/icons-material";
import { Box, Typography, styled } from "@mui/material";

// * MUI Styled Components
const CustomBox = styled(Box)(({ theme }) => ({
    width: "40%",
    [theme.breakpoints.down("md")]: {
        width: "85%",
    },
}));

const GuidesBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-around",
    width: "70%",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
        width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: "0",
        flexDirection: "column",
    },
}));

const GuideBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(2, 0, 2, 0),
    },
}));

export default function Booking() {

    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departureDate: "",
        returnDate: "",
        tripType: "",
        adults: 1,
        children: 0,
        infantsSeat: 0,
        infantsLap: 0,
        travelClass: "economy",
    });
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [loadingFlights, setLoadingFlights] = useState(false);
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [travelClassAnchor, setTravelClassAnchor] = useState(null);


    //My API ACCOUNT CREDENTIALS. LIMITED
    const apiHeaders = {
        "x-rapidapi-key": "3a18d3d1f8mshae70ae7ea31d95fp1b3efcjsne19528445c9f",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    };


    // Fetch Locations
    useEffect(() => {
        const fetchLocations = async () => {
            setLoadingLocations(true);
            try {
                const response = await axios.get(
                    "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=new&locale=en-US",
                    { headers: apiHeaders }
                );
                setLocations(response.data.data || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
            setLoadingLocations(false);
        };

        fetchLocations();
    }, []);


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    // Search Flights
    const handleSearch = async () => {
        setLoadingFlights(true);
        setError("");
        try {
            const {
                origin,
                destination,
                departureDate,
                returnDate,
                travelClass,
                adults,
            } = formData;

            // Find Entity IDs for Origin and Destination
            const originEntity = locations.find((loc) => loc.skyId === origin)?.entityId;
            const destinationEntity = locations.find((loc) => loc.skyId === destination)?.entityId;

            if (!originEntity || !destinationEntity) {
                setError("Invalid origin or destination selected.");
                setLoadingFlights(false);
                return;
            }

            const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${origin}&destinationSkyId=${destination}&originEntityId=${originEntity}&destinationEntityId=${destinationEntity}&date=${departureDate}&returnDate=${returnDate}&cabinClass=${travelClass}&adults=${adults}&currency=USD&market=en-US&countryCode=US`;

            const response = await axios.get(url, { headers: apiHeaders });
            console.log(response)

            if (response.data.data.status === "failure") {
                setError("No flights found. Please check your input and try again.");
                setFlights([]);
            } else {
                setFlights(response.data.data.itineraries || []);
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
            setError("An error occurred while fetching flights. Please try again.");
        }
        setLoadingFlights(false);
    };

    // Open and close passenger dropdown
    const handlePersonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePassengerDropdown = () => {
        setAnchorEl(null);
    };

    // Open and close travel class dropdown
    const handleTravelClassClick = (event) => {
        setTravelClassAnchor(event.currentTarget);
    };
    const handleCloseTravelClassDropdown = () => {
        setTravelClassAnchor(null);
    };
    return (
        <Container >

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 1,
            }} >
                <Typography variant="h3" sx={{ fontSize: "45px", fontWeight: "bold", color: "#000339", my: 3, }}
                >Flights</Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 2,
                }} >
                <Box
                    sx={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <FormControl fullWidth>
                        <Select
                            name="tripType"
                            value={formData.tripType}
                            onChange={handleChange}
                            startAdornment={<SyncAlt />}
                        >
                            <MenuItem value="roundtrip">Roundtrip</MenuItem>
                            <MenuItem value="oneway">One-way</MenuItem>
                            <MenuItem value="multicity">Multi-city</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton onClick={handlePersonClick}>
                        <Badge badgeContent={formData.adults + formData.children} color="primary">
                            <Person />
                        </Badge>
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClosePassengerDropdown}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography>Adults: {formData.adults}</Typography>
                            <Button onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}>-</Button>
                            <Button onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}>+</Button>

                            <Divider sx={{ my: 1 }} />
                            <Typography>Children: {formData.children}</Typography>
                            <Button onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}>-</Button>
                            <Button onClick={() => setFormData({ ...formData, children: formData.children + 1 })}>+</Button>

                            <Divider sx={{ my: 1 }} />
                            <Typography>Infants (Seat): {formData.infantsSeat}</Typography>
                            <Button onClick={() => setFormData({ ...formData, infantsSeat: Math.max(0, formData.infantsSeat - 1) })}>-</Button>
                            <Button onClick={() => setFormData({ ...formData, infantsSeat: formData.infantsSeat + 1 })}>+</Button>

                            <Divider sx={{ my: 1 }} />
                            <Typography>Infants (Lap): {formData.infantsLap}</Typography>
                            <Button onClick={() => setFormData({ ...formData, infantsLap: Math.max(0, formData.infantsLap - 1) })}>-</Button>
                            <Button onClick={() => setFormData({ ...formData, infantsLap: formData.infantsLap + 1 })}>+</Button>
                        </Box>
                    </Popover>
                    <IconButton onClick={handleTravelClassClick}>
                        <ArrowDropDown />
                        Economy
                    </IconButton>
                    <Popover
                        open={Boolean(travelClassAnchor)}
                        anchorEl={travelClassAnchor}
                        onClose={handleCloseTravelClassDropdown}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <List>
                            <ListItem button onClick={() => setFormData({ ...formData, travelClass: "economy" })}>
                                Economy
                            </ListItem>
                            <ListItem button onClick={() => setFormData({ ...formData, travelClass: "premiumEconomy" })}>
                                Premium Economy
                            </ListItem>
                            <ListItem button onClick={() => setFormData({ ...formData, travelClass: "business" })}>
                                Business
                            </ListItem>
                            <ListItem button onClick={() => setFormData({ ...formData, travelClass: "first" })}>
                                First
                            </ListItem>
                        </List>
                    </Popover>
                </Box>



            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 20%" }}>
                    <FormControl fullWidth>
                        <InputLabel>From</InputLabel>
                        <Select
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            disabled={loadingLocations}
                        >
                            {locations.map((loc, index) => (
                                <MenuItem key={index} value={loc.skyId}>
                                    {loc.presentation.title} ({loc.presentation.subtitle})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ flex: "1 1 20%" }}>
                    <FormControl fullWidth>
                        <InputLabel>To</InputLabel>
                        <Select
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            disabled={loadingLocations}
                        >
                            {locations.map((loc, index) => (
                                <MenuItem key={index} value={loc.skyId}>
                                    {loc.presentation.title} ({loc.presentation.subtitle})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ flex: "1 1 20%" }}>

                    <SingleDatePicker
                        startDate={new Date()}
                        onChange={(startDate) => onDateChange(formData.departureDate)}
                        minDate={new Date(2024, 0, 1)}
                        maxDate={new Date(2100, 0, 1)}
                        startDatePlaceholder="Date"
                        disabled={false}
                        className="my-own-class-name"
                    />
                </Box>
                {formData.tripType === "roundtrip" && (
                    <Box sx={{ flex: "1 1 20%" }}>

                        <RangeDatePicker
                            startDate={new Date()}
                            endDate={new Date()}
                            onChange={(startDate, endDate) => onDateChange(formData.departureDate, formData.returnDate)}
                            minDate={new Date(2024, 0, 1)}
                            maxDate={new Date(2100, 0, 1)}
                            startDatePlaceholder="Start Date"
                            endDatePlaceholder="End Date"
                            disabled={false}
                            className="my-own-class-name"
                        />
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CustomButton
                    backgroundColor="#0F1B4C"
                    color="#fff"
                    buttonText="Explore"
                    guideBtn={true}
                />
            </Box >
        </Container>
    );
}