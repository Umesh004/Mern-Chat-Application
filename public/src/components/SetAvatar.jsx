import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Number of avatar files you have in the public/avatars directory
  const totalAvatars = 8; // Update this to match your actual number of avatars

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    // Function to load avatars from public/avatars directory
    const loadLocalAvatars = async () => {
      try {
        const avatarPaths = [];

        // Randomly select 4 avatars from your collection to display
        const selectedIndexes = new Set();
        while (selectedIndexes.size < 4) {
          selectedIndexes.add(Math.floor(Math.random() * totalAvatars) + 1);
        }

        // Convert Set to Array and sort for consistent ordering
        const indexesArray = Array.from(selectedIndexes).sort();

        // Create paths for each selected avatar
        indexesArray.forEach((index) => {
          // Assuming your avatars are named avatar1.svg, avatar2.svg, etc.
          avatarPaths.push(`/avatars/av${index}.png`);
        });

        setAvatars(avatarPaths);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading avatars:", error);
        toast.error("Failed to load avatars", toastOptions);
      }
    };

    loadLocalAvatars();
  }, []);

  return (
    <>
      <Container>
        <div className="title-container">
          <h1>Pick an Avatar as your profile picture</h1>
        </div>
        {isLoading ? (
          <div className="loading">
            <p>Loading avatars...</p>
          </div>
        ) : (
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  } `}
                >
                  <img
                    src={avatar}
                    alt={`avatar-${index}`}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <button onClick={setProfilePicture} className="submit-btn">
          Set as Profile Picture
        </button>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loading {
    color: white;
    font-size: 1.5rem;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
