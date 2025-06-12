import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1E3A8A", // flat strong blue
        color: "#FFFFFF",
        padding: "1rem 2rem",
        textAlign: "center",
        fontSize: "0.9rem",
        marginTop: "auto",
      }}
    >
      <p>© 2025 Escape the Web. All rights reserved.</p>
      <p>
        <a
          href="/privacy"
          style={{ color: "#2563EB", textDecoration: "none", marginRight: "1rem" }}
        >
          Privacy Policy
        </a>
        <a
          href="/terms"
          style={{ color: "#2563EB", textDecoration: "none" }}
        >
          Terms of Service
        </a>
      </p>
    </footer>
  );
}

export default Footer;

