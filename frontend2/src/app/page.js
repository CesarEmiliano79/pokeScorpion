import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Inicio from "./pages/inicio/page.js";
import ProtectedPage from "@/components/ProtectedPage";
export default function Home() {
  return (
    <div className={styles.page}>
      <ProtectedPage>
        <Inicio/>
      </ProtectedPage>
    </div>
  );
}
