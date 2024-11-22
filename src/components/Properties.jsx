// * Components
import properties from "../data/properties";
import House from "./House";

// * MUI Components
import { Box, Container, Typography, styled } from "@mui/material";

// * Styled Components
const PropertiesBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const PropertiesTextBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
}));

export default function Properties() {
  return (
    <Box sx={{ backgroundColor: "#F5FAFE", }}>
      <Container>

        <PropertiesBox>
          {properties.map((property) => (
            <House
              key={property.id}
              img={property.img}
              price={property.price}
              address={property.address}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              space={property.space}
            />
          ))}
        </PropertiesBox>
      </Container>
    </Box>
  );
}
