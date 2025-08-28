import styles from "./schedule.module.css";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DaySelector from "@/components/DaySelector";
import Footer from "@/components/Footer";

const Schedule = ({ scheduleData }) => {
  const [day, setDay] = useState("mon");

  const filterBands = (day) => {
    setDay(day);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.programContainer}>
        <div className={styles.programBox}>
          <h1 className={styles.header}>Programme</h1>
          <DaySelector onDayChange={filterBands} />
        </div>
        <div className={styles.stageBox}>
          {scheduleData &&
            Object.entries(scheduleData).map(([stage, days]) => (
              <div key={stage}>
                <h2 className={styles.subHeader}>{stage}</h2>
                {days[day] &&
                  days[day]
                    .filter((act) => act.act !== "break")
                    .map((act, index) => (
                      <div key={index} className={styles.actBox}>
                        <p>{act.act}</p>
                        <p>
                          {act.start} - {act.end}
                          {/* for cancelation - optional  */}
                          {act.cancelled && (
                            <Image
                              src="/images/cancelled.png"
                              alt="Cancelled"
                              width={100}
                              height={70}
                              className={styles.cancelled}
                            />
                          )}
                          {/* for cancelation - optional  */}
                        </p>
                      </div>
                    ))}
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  try {
    // Fetch artists from multiple genres to get enough bands for 7-day festival
    const genres = [
      { id: 132, name: "Pop" },
      { id: 113, name: "Dance" },
      { id: 152, name: "Rock" },
      { id: 116, name: "Rap/Hip Hop" },
      { id: 165, name: "R&B" },
    ];

    let allBands = [];

    // Fetch artists from different genres
    for (const genre of genres) {
      // Use all 5 genres to get enough bands for 7-day festival
      try {
        const genreResponse = await fetch(
          `https://api.deezer.com/genre/${genre.id}/artists`
        );
        if (genreResponse.ok) {
          const genreData = await genreResponse.json();
          const genreBands = genreData.data
            .slice(0, 15)
            .map((artist, index) => ({
              id: `${genre.id}-${artist.id}`,
              name: artist.name,
              logo:
                artist.picture_big || artist.picture_medium || artist.picture,
              bio: `${genre.name} artist with millions of fans worldwide. Known for their distinctive sound and memorable performances.`,
              genre: genre.name,
              slug: artist.name.toLowerCase().replace(/\s+/g, "-"),
              logoCredits: "Image provided by Deezer",
            }));
          allBands = [...allBands, ...genreBands];
        }
      } catch (error) {
        console.error(`Error fetching ${genre.name} artists:`, error);
      }
    }

    // If we don't have enough bands, fall back to chart artists
    if (allBands.length < 20) {
      const deezerResponse = await fetch(
        "https://api.deezer.com/chart/artists"
      );
      if (deezerResponse.ok) {
        const deezerData = await deezerResponse.json();
        const chartBands = deezerData.artists.data.map((artist, index) => ({
          id: artist.id,
          name: artist.name,
          logo: artist.picture_big || artist.picture_medium || artist.picture,
          bio: `Popular chart artist with millions of fans worldwide. Known for their distinctive sound and memorable performances.`,
          genre: "Contemporary Music",
          slug: artist.name.toLowerCase().replace(/\s+/g, "-"),
          logoCredits: "Image provided by Deezer",
        }));
        allBands = [...allBands, ...chartBands];
      }
    }

    // Create comprehensive 7-day festival schedule across 3 stages
    const scheduleData = {
      Midgard: {
        mon: [
          { act: allBands[0]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[1]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[2]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        tue: [
          { act: allBands[3]?.name || "TBA", start: "18:30", end: "20:00" },
          { act: allBands[4]?.name || "TBA", start: "20:30", end: "22:00" },
          { act: allBands[5]?.name || "TBA", start: "22:30", end: "24:00" },
        ],
        wed: [
          { act: allBands[6]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[7]?.name || "TBA", start: "21:00", end: "22:30" },
          { act: allBands[8]?.name || "TBA", start: "23:00", end: "24:30" },
        ],
        thu: [
          { act: allBands[9]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[10]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[11]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        fri: [
          { act: allBands[12]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[13]?.name || "TBA", start: "21:00", end: "22:30" },
          { act: allBands[14]?.name || "TBA", start: "23:00", end: "24:30" },
        ],
        sat: [
          { act: allBands[57]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[58]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[59]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        sun: [
          { act: allBands[60]?.name || "TBA", start: "17:00", end: "18:30" },
          { act: allBands[61]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[62]?.name || "TBA", start: "21:00", end: "22:30" },
        ],
      },
      Vanaheim: {
        mon: [
          { act: allBands[15]?.name || "TBA", start: "17:30", end: "19:00" },
          { act: allBands[16]?.name || "TBA", start: "19:30", end: "21:00" },
          { act: allBands[17]?.name || "TBA", start: "21:30", end: "23:00" },
        ],
        tue: [
          { act: allBands[18]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[19]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[20]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        wed: [
          { act: allBands[21]?.name || "TBA", start: "18:30", end: "20:00" },
          { act: allBands[22]?.name || "TBA", start: "20:30", end: "22:00" },
          { act: allBands[23]?.name || "TBA", start: "22:30", end: "24:00" },
        ],
        thu: [
          { act: allBands[24]?.name || "TBA", start: "17:30", end: "19:00" },
          { act: allBands[25]?.name || "TBA", start: "19:30", end: "21:00" },
          { act: allBands[26]?.name || "TBA", start: "21:30", end: "23:00" },
        ],
        fri: [
          { act: allBands[27]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[28]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[29]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        sat: [
          { act: allBands[51]?.name || "TBA", start: "17:00", end: "18:30" },
          { act: allBands[52]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[53]?.name || "TBA", start: "21:00", end: "22:30" },
        ],
        sun: [
          { act: allBands[54]?.name || "TBA", start: "16:00", end: "17:30" },
          { act: allBands[55]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[56]?.name || "TBA", start: "20:00", end: "21:30" },
        ],
      },
      Jotunheim: {
        mon: [
          { act: allBands[30]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[31]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[32]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        tue: [
          { act: allBands[33]?.name || "TBA", start: "18:30", end: "20:00" },
          { act: allBands[34]?.name || "TBA", start: "20:30", end: "22:00" },
          { act: allBands[35]?.name || "TBA", start: "22:30", end: "24:00" },
        ],
        wed: [
          { act: allBands[36]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[37]?.name || "TBA", start: "21:00", end: "22:30" },
          { act: allBands[38]?.name || "TBA", start: "23:00", end: "24:30" },
        ],
        thu: [
          { act: allBands[39]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[40]?.name || "TBA", start: "20:00", end: "21:30" },
          { act: allBands[41]?.name || "TBA", start: "22:00", end: "23:30" },
        ],
        fri: [
          { act: allBands[42]?.name || "TBA", start: "19:00", end: "20:30" },
          { act: allBands[43]?.name || "TBA", start: "21:00", end: "22:30" },
          { act: allBands[44]?.name || "TBA", start: "23:00", end: "24:30" },
        ],
        sat: [
          { act: allBands[45]?.name || "TBA", start: "16:00", end: "17:30" },
          { act: allBands[46]?.name || "TBA", start: "18:00", end: "19:30" },
          { act: allBands[47]?.name || "TBA", start: "20:00", end: "21:30" },
        ],
        sun: [
          { act: allBands[48]?.name || "TBA", start: "15:00", end: "16:30" },
          { act: allBands[49]?.name || "TBA", start: "17:00", end: "18:30" },
          { act: allBands[50]?.name || "TBA", start: "19:00", end: "20:30" },
        ],
      },
    };

    return { props: { scheduleData } };
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return { props: { scheduleData: {} } };
  }
}

export default Schedule;
