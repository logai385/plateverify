import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import LoginIcon from "@mui/icons-material/Login";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PhoneIcon from "@mui/icons-material/Phone";
import PushPinIcon from "@mui/icons-material/PushPin";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import { logOut } from "../../../features/auth/authSlice";
import { useGetUserProfileQuery } from "../usersApiSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "25px",
  boxShadow: 24,
  p: 4,
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading, isError } = useGetUserProfileQuery();

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (isError) {
      const message = error.data.message;
      toast.error(message);
    }
  }, [isError, error]);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        border: "2px solid #e4e5e7",
        borderRadius: "25px",
        py: 2,
        mt: 12,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BadgeIcon sx={{ fontSize: 80 }} />
        <Typography variant="h1">User Profile</Typography>
      </Box>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            {data.userProfile?.avatar ? (
              <Avatar
                src={data.userProfile.avatar}
                sx={{ width: 100, height: 100 }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: "6rem" }} color="info" />
            )}
          </Box>
          <StyledDivider />
          <Grid container>
            <Grid item md={12} sm={6}>
              <Stack direction="row" spacing={8}>
                <Stack>
                  <List>
                    {/* email */}
                    <ListItem>
                      <ListItemIcon>
                        <AttachEmailIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText primary={data.userProfile.email} />
                    </ListItem>
                    {/* fullname */}
                    <ListItem>
                      <ListItemIcon>
                        <LabelImportantIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Fullname: ${data.userProfile.fullname}`}
                      />
                    </ListItem>
                  </List>
                </Stack>
                <Stack>
                  <List>
                    {/* taxCode */}
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Tax Code: ${data.userProfile.taxCode}`}
                      />
                    </ListItem>
                    {/* Role */}
                    <ListItem>
                      <ListItemIcon>
                        <ManageAccountsIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Roles: ${data.userProfile.roles.join(", ")}`}
                      />
                    </ListItem>
                  </List>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Button
                sx={{ mt: 3, mb: 2, borderRadius: "25px" }}
                fullWidth
                variant="contained"
                color="success"
                size="large"
                endIcon={<EditIcon />}
                onClick={() => navigate("/edit-profile")}
              >
                <Typography variant="h5">Edit Profile</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
