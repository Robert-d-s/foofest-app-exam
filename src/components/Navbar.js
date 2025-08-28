import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Navigating to: ${path}`);
    router.push(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={(e) => handleNavigation(e, "/")}>
        ColorFOO ~ 1st - 7th July 2023
      </div>
      {/* <p>1st - 7th July 2023</p> */}
      <div className={styles.navLinks}>
        <div onClick={(e) => handleNavigation(e, "/About")}>About</div>
        <div onClick={(e) => handleNavigation(e, "/Schedule")}>Schedule</div>
        <div onClick={(e) => handleNavigation(e, "/booking")}>Tickets</div>
      </div>
    </nav>
  );
};

export default Navbar;
