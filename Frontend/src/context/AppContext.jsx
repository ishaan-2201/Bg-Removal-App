import { createContext, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credits, setCredits] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const loadUserCredits = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });
      if (response.data.success) {
        setCredits(response.data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn({});
      }
      setImage(image);
      setResultImage(false);
      navigate("/result");
      const token = await getToken();
      const formData = new FormData();
      image && formData.append("image", image);
      const { data } = await axios.post(
        backendUrl + "/api/image/remove-bg",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        setResultImage(data.resultImage);
        data.credits && setCredits(data.credits);
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message);
        data.credits && setCredits(data.credits);
        if (data.credits === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const contextValue = {
    credits,
    setCredits,
    loadUserCredits,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
    backendUrl,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
