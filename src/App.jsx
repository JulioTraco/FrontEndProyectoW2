import { useState } from "react";

const API = "http://localhost:8000";

function App() {
  // Crear usuario
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMsg, setRegMsg] = useState(null);

  // Login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState(null);

  // Mostrar info
  const [userInfo, setUserInfo] = useState(null);
  const [meMsg, setMeMsg] = useState(null);

  // ── Crear usuario ──
  async function crearUsuario() {
    setRegMsg(null);
    try {
      const res = await fetch(`${API}/crear-usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, userName: regUsername, password: regPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegMsg({ type: "success", text: "✓ Usuario creado exitosamente." });
        setRegName(""); setRegUsername(""); setRegPassword("");
      } else {
        setRegMsg({ type: "error", text: `✗ ${data.detail || "Error al crear usuario."}` });
      }
    } catch {
      setRegMsg({ type: "error", text: "✗ No se pudo conectar con el servidor." });
    }
  }

  // ── Login ──
  async function login() {
    setLoginMsg(null);
    const formData = new URLSearchParams();
    formData.append("username", loginUsername);
    formData.append("password", loginPassword);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setLoginMsg({ type: "success", text: `✓ Usuario autenticado.\nToken: ${data.access_token}` });
      } else {
        setLoginMsg({ type: "error", text: `✗ ${data.detail || "Credenciales incorrectas."}` });
      }
    } catch {
      setLoginMsg({ type: "error", text: "✗ No se pudo conectar con el servidor." });
    }
  }

  // ── Mostrar info (via cookie) ──
  async function mostrarInfo() {
    setMeMsg(null);
    setUserInfo(null);
    try {
      const res = await fetch(`${API}/users/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUserInfo(data);
      } else {
        setMeMsg({ type: "error", text: `✗ ${data.detail || "No autorizado."}` });
      }
    } catch {
      setMeMsg({ type: "error", text: "✗ No se pudo conectar con el servidor." });
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>Auth App</h1>
        <p style={styles.subtitle}>Proyecto Parcial 2 — Web 2</p>

        {/* ── Crear usuario ── */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Crear Usuario</h2>
          <input style={styles.input} placeholder="Nombre" value={regName} onChange={e => setRegName(e.target.value)} />
          <input style={styles.input} placeholder="Username" value={regUsername} onChange={e => setRegUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Contraseña" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
          <button style={styles.btn} onClick={crearUsuario}>Crear Usuario</button>
          {regMsg && <p style={regMsg.type === "success" ? styles.success : styles.error}>{regMsg.text}</p>}
        </div>

        {/* ── Login ── */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Iniciar Sesión</h2>
          <input style={styles.input} placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          <button style={styles.btn} onClick={login}>Entrar</button>
          {loginMsg && <p style={loginMsg.type === "success" ? styles.success : styles.error}>{loginMsg.text}</p>}
        </div>

        {/* ── Mostrar info ── */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Información del Usuario</h2>
          <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={mostrarInfo}>Mostrar Información</button>
          {meMsg && <p style={styles.error}>{meMsg.text}</p>}
          {userInfo && (
            <div style={styles.userCard}>
              <p><strong>Nombre:</strong> {userInfo.name}</p>
              <p><strong>Username:</strong> {userInfo.userName}</p>
              <p style={styles.hash}><strong>Password (hash):</strong> {userInfo.password}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem",
  },
  container: {
    width: "100%",
    maxWidth: "460px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "1.8rem",
    color: "#1a56db",
    fontFamily: "sans-serif",
    margin: 0,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.9rem",
    margin: 0,
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #dce3ed",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  cardTitle: {
    fontSize: "1rem",
    color: "#1e3a5f",
    fontFamily: "sans-serif",
    margin: 0,
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  input: {
    padding: "0.6rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
  },
  btn: {
    padding: "0.65rem",
    backgroundColor: "#1a56db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  btnOutline: {
    backgroundColor: "#fff",
    color: "#1a56db",
    border: "2px solid #1a56db",
  },
  success: {
    color: "#065f46",
    backgroundColor: "#d1fae5",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
  error: {
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
  },
  userCard: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: "#1e3a5f",
  },
  hash: {
    wordBreak: "break-all",
    fontSize: "0.8rem",
    color: "#374151",
  },
};

export default App;