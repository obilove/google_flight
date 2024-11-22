// * Components

// * Images
import HeroImg from "../assets/banner.png";

// * MUI Components
import { Box, Container, Typography, styled } from "@mui/material";

// * MUI Icons

// * Styled Components
const CustomHeroBox = styled(Box)(({ theme }) => ({
    // display: "flex",
    justifyContent: "center",
    // gap: theme.spacing(5),
    //  marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
        fontSize: "40px",
    },
}));

export default function Hero() {
    return (
        <Box
        >
            <Container>
                <CustomHeroBox>
                    <img
                        src={HeroImg}
                        alt="hero illustration"
                        style={{ maxWidth: "100%" }}
                    />

                </CustomHeroBox>
            </Container>
        </Box>
    );
}