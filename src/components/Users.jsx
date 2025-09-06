import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("enabled");
  const [flippedUser, setFlippedUser] = useState(null);
  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filteredUsers = users.filter(
    (u) => (selectedTab === "enabled" ? u.enabled === true : u.enabled === false)
  );

  const addUser = () => {
    alert("Añadir un usuario");
  };

  // Ajustar la altura de la card al contenido más alto
  useLayoutEffect(() => {
    if (cardRef.current) {
      const front = cardRef.current.querySelector(".front");
      const back = cardRef.current.querySelector(".back");
      const maxHeight = Math.max(
        front?.offsetHeight || 0,
        back?.offsetHeight || 0
      );
      setCardHeight(maxHeight);
    }
  }, [filteredUsers, flippedUser]);

  return (
    <div className="flex w-full flex-col items-center gap-5 py-10">
      <div
        ref={cardRef}
        className="w-3/4 perspective-[1000px]"
        style={{ minHeight: cardHeight }}
      >
        <div
          className={`relative grid transition-transform duration-500 [transform-style:preserve-3d] ${
            flippedUser ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="front rounded-xl shadow-lg bg-[color:var(--secondary)] p-4 [backface-visibility:hidden] z-10">
            <div className="w-full flex flex-row">
                <div className="w-full flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">Usuarios</h4>
                    <button
                        className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={addUser}
                    >
                    <span className="text-lg font-bold">+</span> Añadir
                    </button>

                </div>
            </div>
            <hr className="border-[color:var(--primary)] mb-2" />

            {/* Tabs */}
            <div className="flex border-b border-[color:var(--primary)] mb-4">
              {["enabled", "disabled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 -mb-px font-medium ${
                    selectedTab === tab
                      ? "border-b-4 border-[color:var(--primary)] text-[color:var(--text)] font-semibold"
                      : "text-[color:var(--text)]"
                  }`}
                >
                  {tab === "enabled" ? "Enabled" : "Disabled"}
                </button>
              ))}
            </div>

            {/* Tabla */}
            {filteredUsers.length === 0 ? (
              <div className="py-6 text-center text-[color:var(--text)]">
                No hay usuarios en esta categoría
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-[color:var(--divide)]">
                  <thead>
                    <tr>
                      <th className="w-1/2 py-3 text-left text-[color:var(--text)] font-medium">
                        Nombre
                      </th>
                      <th className="w-1/2 py-3 text-left text-[color:var(--text)] font-medium">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y [color:var(--divide)]">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.idUser}
                        className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        onClick={() => setFlippedUser(user)}
                      >
                        <td className="w-1/2 py-2">{user.userName}</td>
                        <td className="w-1/2 py-2">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Back */}
          <div className="back absolute inset-0 rounded-xl shadow-lg bg-[color:var(--primary)] text-[color:var(--text-light)] p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col">
            <button
              onClick={() => setFlippedUser(null)}
              className="mb-4 px-4 py-2 bg-[color:var(--secondary)] text-[color:var(--text)] hover:bg-[color:var(--secondary-light-hover)] rounded-xl w-max"
            >
              ← Volver
            </button>
            {flippedUser && (
              <>
                <h4 className="text-xl font-semibold mb-2">{flippedUser.userName}</h4>
                <p><strong>Email:</strong> {flippedUser.email}</p>
                <p><strong>Role:</strong> {flippedUser.roleName}</p>
                <p><strong>Plan:</strong> {flippedUser.planName}</p>
                <p><strong>Status:</strong> {flippedUser.enabled ? "Enabled" : "Disabled"}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
