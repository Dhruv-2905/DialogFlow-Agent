import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { useKeycloak } from "@react-keycloak/web";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import Cookies from "js-cookie"; // Add js-cookie library for better cookie handling

function App() {
  const { keycloak, initialized } = useKeycloak();

  const extractUsernameFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken?.name || "User"; // Default to "User" if name is not found
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return "User";
    }
  };

  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      const jwt = keycloak.token;

      if (jwt) {
        // Extract username
        const username = extractUsernameFromToken(jwt);
        console.log("name is: ", username);

        fetch(
          "<url>/username",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username }),
          }
        ).then((response) => response.json());

        // Pass token and username as session parameters to the chatbot
        const messengerElement = document.querySelector("df-messenger");
        if (messengerElement) {
          messengerElement.setAttribute(
            "query-params",
            `sessionInfo.parameters.token=${jwt}&sessionInfo.parameters.username=${username}`
          );
        }
      }
    }
  }, [keycloak, initialized]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return keycloak?.authenticated ? (
    <div>
      <Navbar />
      <df-messenger
        location=""
        intent="WELCOME"
        project-id=""
        agent-id=""
        language-code=""
      />
    </div>
  ) : (
    <div>Not authenticated. Please log in.</div>
  );
}

export default App;
