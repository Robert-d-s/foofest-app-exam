import styles from "./FestMap2.module.css";

const FestMap = ({ src, alt, isExpanded, onMapClick }) => {
  return isExpanded ? (
    <div className={styles.expanded} onClick={onMapClick}>
      <img src={src} alt={alt} className={styles.expandedImage} />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.festmap} onClick={onMapClick}>
        <img src={src} alt={alt} className={styles.image} />
      </div>
      <div className={styles.textContainer}>
        <h2>Tent Area</h2>
        <p>
          Choose an authentic camping experience by bringing your own tent to
          the ColorFoo Fest village or book one of our pre-pitched tents.
        </p>
        <h2>Glamping</h2>
        <p>
          Our glamping options are the best choice if you want to enjoy the
          whole festival experience without sacrificing comfort.
        </p>
        <h2>Car Camping</h2>
        <p>
          You can choose to camp in your own car and pitch your tent nearby, in
          a dedicated area of 3x8 meters. The perfect option for those who want
          the best of both worlds.
        </p>
      </div>
    </div>
  );
};

export default FestMap;
