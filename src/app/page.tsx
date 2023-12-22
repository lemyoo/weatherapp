"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { CiCloud } from "react-icons/ci";
import { BsCloudHaze } from "react-icons/bs";
import moment from "moment";

interface IWeather {
  name: string;
  main: { temp: number };
  weather: [{ description: string; main: string }];
  sys: {
    country: string;
  };
}

interface ICloud {
  name: string;
}

const getCurrentDate = () => {
  const date = moment().format("DD, MMMM");
  return date;
};

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<IWeather>({
    name: "",
    main: { temp: 0 },
    weather: [{ description: "", main: "" }],
    sys: { country: "" },
  });
  const [city, setCity] = useState("accra");

  const [cloudName, setCloudName] = useState<ICloud>({ name: "" });

  const fetchData = async (cityName: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/weather?address=" + cityName);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataCoordinats = async (longitude: number, latitude: number) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/weather?lon=" + longitude + "&lat=" + latitude
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          fetchDataCoordinats(longitude, latitude);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);
  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
          className={styles.weatherLocation}>
          <input
            className={styles.input_field}
            placeholder="Enter city name"
            type="text"
            id="cityName"
            name="cityName"
            onChange={(e) => setCity(e.target.value)}
          />
          <button className={styles.search_button} type="submit">
            Search
          </button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0].main !== "" ? (
          <>
            {console.log(weatherData)}
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                {weatherData.weather[0].main === "Clouds" ? (
                  <CiCloud />
                ) : weatherData.weather[0].main === "Haze" ? (
                  <BsCloudHaze />
                ) : null}
              </div>
              <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>
                    {(weatherData.main.temp - 273.5).toFixed(0) +
                      " " +
                      String.fromCharCode(176) +
                      "C"}
                  </span>
                </div>
                <div className={styles.weatherCondition}>
                  {weatherData.weather[0].description.toUpperCase()}
                </div>
              </div>
            </div>
            <div className={styles.place}>
              {weatherData.name} , {weatherData.sys.country}
            </div>
            <div className={styles.date}>{date}</div>
          </>
        ) : (
          <div className={styles.place}>Loading...</div>
        )}
      </article>
    </main>
  );
}
