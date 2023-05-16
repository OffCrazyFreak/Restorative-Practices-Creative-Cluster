import {
  useMediaQuery,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  SwipeableDrawer,
  Tooltip,
  IconButton,
  Button,
  Box,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

import { useEffect, useState } from "react";

function GMap({ google, visibleOrganizations, setOrganizations }) {
  const [orgMarkers, setOrgMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const mqSub600 = useMediaQuery("(max-width: 600px)");

  function handleCloseDrawer() {
    selectedMarker.setAnimation(null);
    setSelectedMarker(null);
  }

  useEffect(() => {
    setOrgMarkers([]);
    const geocoder = new google.maps.Geocoder();

    // Geocode each organization's address with a delay between markers
    visibleOrganizations.forEach((organization, index) => {
      setTimeout(() => {
        geocoder.geocode(
          { address: organization.address },
          (results, status) => {
            if (status === "OK") {
              const location = results[0].geometry.location;

              const marker = {
                organization: organization,
                position: { lat: location.lat(), lng: location.lng() },
              };
              setOrgMarkers((prevMarkers) => [...prevMarkers, marker]);
            } else {
              console.error("Geocoding failed:", status);
            }
          }
        );
      }, index * 200);
    });
  }, [google.maps.Geocoder, visibleOrganizations]);

  return (
    <>
      <Map
        google={google}
        zoom={4}
        style={{
          // position: "relative",

          borderRadius: 16,

          marginBottom: 50,
        }}
        initialCenter={{ lat: 52.52, lng: 13.4049 }}
      >
        {orgMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.organization.name}
            orgInfo={marker.organization}
            onClick={(props, clickedMarker) => {
              if (selectedMarker === clickedMarker) {
                // Clicked marker is already bouncing, stop its animation
                setSelectedMarker(null);
                clickedMarker.setAnimation(null);
              } else {
                // Stop animation on the previously bouncing marker (if any)
                if (selectedMarker) {
                  selectedMarker.setAnimation(null);
                }
                // Start animation on the clicked marker
                setSelectedMarker(clickedMarker);
                clickedMarker.setAnimation(google.maps.Animation.BOUNCE);
              }
            }}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
      </Map>

      {selectedMarker && (
        <SwipeableDrawer
          anchor={mqSub600 ? "bottom" : "left"}
          open={selectedMarker !== null}
          onClose={handleCloseDrawer}
        >
          <Box
            style={{
              width: 480,
              maxWidth: "100%",
              maxHeight: "40vh",
              padding: "5%",
            }}
          >
            <Box
              disableGutters
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                {selectedMarker.orgInfo.name}
              </Typography>

              <Tooltip title="Close">
                <IconButton edge="end" onClick={handleCloseDrawer}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <List dense>
              <ListItem divider>
                <ListItemText
                  primary="Description"
                  secondary={selectedMarker.orgInfo.description}
                  style={{ textAlign: "justify" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact"
                  secondary={selectedMarker.orgInfo.contactName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact Email"
                  secondary={
                    <Link
                      underline="none"
                      color="white"
                      href={`mailto:${selectedMarker.orgInfo.contactEmail}`}
                    >
                      {selectedMarker.orgInfo.contactEmail}
                    </Link>
                  }
                />
              </ListItem>
              <ListItem divider>
                <ListItemText
                  primary="Contact Telephone"
                  secondary={
                    <Link
                      underline="none"
                      color="white"
                      href={`tel:${selectedMarker.orgInfo.contactTel}`}
                    >
                      {selectedMarker.orgInfo.contactTel}
                    </Link>
                  }
                />
              </ListItem>

              {selectedMarker.orgInfo.references && (
                <ListItem divider>
                  <ListItemText
                    primary="References"
                    secondary={selectedMarker.orgInfo.references}
                    style={{ textAlign: "justify" }}
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.lookingFor && (
                <ListItem divider>
                  <ListItemText
                    primary="Looking for"
                    secondary={selectedMarker.orgInfo.lookingFor}
                    style={{ textAlign: "justify" }}
                  />
                </ListItem>
              )}

              <ListItem divider>
                <ListItemText
                  primary="Address"
                  secondary={selectedMarker.orgInfo.address}
                />
              </ListItem>

              {selectedMarker.orgInfo.webUrl && (
                <ListItem>
                  <ListItemText
                    primary="Website"
                    secondary={
                      <Link
                        target="_blank"
                        underline="none"
                        color="white"
                        href={selectedMarker.orgInfo.webUrl}
                        style={{}}
                      >
                        {selectedMarker.orgInfo.webUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.facebookUrl && (
                <ListItem>
                  <ListItemText
                    primary="Facebook"
                    secondary={
                      <Link
                        target="_blank"
                        underline="none"
                        color="white"
                        href={selectedMarker.orgInfo.facebookUrl}
                      >
                        {selectedMarker.orgInfo.facebookUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.instagramUrl && (
                <ListItem>
                  <ListItemText
                    primary="Instagram"
                    secondary={
                      <Link
                        target="_blank"
                        underline="none"
                        color="white"
                        href={selectedMarker.orgInfo.instagramUrl}
                      >
                        {selectedMarker.orgInfo.instagramUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.linkedInUrl && (
                <ListItem>
                  <ListItemText
                    primary="LinkedIn"
                    secondary={
                      <Link
                        target="_blank"
                        underline="none"
                        color="white"
                        href={selectedMarker.orgInfo.linkedInUrl}
                      >
                        {selectedMarker.orgInfo.linkedInUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Box
              style={{
                paddingBlock: "5%",

                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                style={{ width: 100 }}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setOrganizations((organizations) =>
                    visibleOrganizations.filter(
                      (org) => org.id !== selectedMarker.orgInfo.id
                    )
                  );
                  handleCloseDrawer();
                }}
              >
                Delete
              </Button>

              <Button
                variant="contained"
                style={{ width: 100 }}
                startIcon={<EditIcon />}
                onClick={() => {
                  // TODO:
                  // setOrganization(selectedMarker.orgInfo);
                  // setOpenFormModal(true);
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>
        </SwipeableDrawer>
      )}
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAaCAGajZa5XI9XgOwsEM9sw2sxM0Oawkc",
})(GMap);
