import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import api from "../api/axios";
import { useTranslation } from 'react-i18next';
import { emailValidator } from "../utils/validator";

function Users() {

  const { t, i18n } = useTranslation();

  const roleNameToId = {
    "ROLE_ADMIN": 1,
    "ROLE_ACCOUNTING": 2,
    "ROLE_USER": 3
  };

  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("enabled");
  const [flippedUser, setFlippedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "userName", direction: "asc" });
  const [formData, setFormData] = useState({ username:"", password:"", email:"", preferredLanguage: i18n.language, idRole:"", idPlan:1})
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ idUser:"", idRole: "", enabled: true });

  useEffect(() => {
    api
      .get("/users")
      .then(
        (res) => {setUsers(res.data);
        })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (flippedUser) {
      setEditData({
        idUser: flippedUser.idUser,
        idRole: roleNameToId[flippedUser.roleName] || 3,
        enabled: flippedUser.enabled
      });
    }
  }, [flippedUser]);

  const filteredUsers = users
                        .filter((u) =>
                          selectedTab === "enabled" ? u.enabled === true : u.enabled === false
                        );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  //Sorting columns
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  //Add button
  const addUser = () => {
    setShowAddForm(true);
  };

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    if (!frontRef || !backRef) return;

    const frontHeight = frontRef.current.scrollHeight;
    const backHeight = backRef.current.scrollHeight;
    const maxHeight = Math.max(frontHeight, backHeight);
    
    setCardHeight(maxHeight);
  }, [filteredUsers, flippedUser, isEditing, showAddForm, error]);

  //Changes in form inputs
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  //Submit new User
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      setError(t('error.all_fields_required'));
      return;
    }
    if(!emailValidator(formData.email)){
      setError(t('error.email_invalid'));
      return;
    }

    try {
      const response = await api.post("/users", formData);

      setUsers((prevUsers) => [...prevUsers, response.data]);

      setShowAddForm(false);
      setError(t(''));
      setFormData({ username:"", password:"", email:"", preferredLanguage: i18n.language, idRole:"", idPlan:1 });

    } catch (err) {
      console.error(err);
      setError(err.response.data.message);
    }
  };

  //Cancel Add
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setError(t(''));
  }

  //Edit
  const handleEdit = () => {
    if (flippedUser) {
      setIsEditing(true);
      setEditData({ idUser: flippedUser.idUser, idRole: roleNameToId[flippedUser.roleName] || 3, enabled: flippedUser.enabled });
    }
  };

    //Back
    const handleBack = () => {
      setFlippedUser(null);
      setIsEditing(false);
      setCardHeight(0);
    }

    // Cancel Edition
    const handleCancelEdit = () => {
      setIsEditing(false);
      setCardHeight(0);
    };

    // Save Edition
    const handleSaveEdit = async () => {
      try {
        const response = await api.patch("/users", editData);
        // Actualizar lista local
        setUsers((prev) =>
          prev.map((u) =>
            u.idUser === flippedUser.idUser ? { ...u, ...response.data } : u
          )
        );
        setFlippedUser((prev) => ({ ...prev, ...response.data }));
        setIsEditing(false);
        setCardHeight(0);
      } catch (err) {
        console.error(err);
        setError(err.response.data.message);
      }
    };

  return (
    <div className="flex w-full flex-col items-center gap-5 py-10">
      {/* Card Add User */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
            <h3 className="text-xl font-semibold mb-4">{t('users.add_user')}</h3>
            <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
              <input 
                type="text"
                name="username"
                placeholder={t('users.name')}
                onChange={handleChange}
                className="p-2 rounded-lg border bg-[color:var(--background)]"
                 />
              <input
                type="password"
                name="password"
                placeholder={t('users.password')}
                onChange={handleChange}
                className="p-2 rounded-lg border bg-[color:var(--background)]"
                 />
              <select
                name="idRole"
                onChange={handleChange}
                className="p-2 rounded-lg border bg-[color:var(--background)]">
                  <option value="1">{t('users.admin')}</option>
                  <option value="2">{t('users.accounting')}</option>
                  <option value="3">{t('users.user')}</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder={t('users.email')}
                onChange={handleChange}
                className="p-2 rounded-lg border bg-[color:var(--background)]"
                 />
                {error && (
                  <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                    {error}
                  </div>
                )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                  onClick={handleCancelAdd}
                >
                  {t('button.cancel')}
                </button>
                <button
                  type="submit"
                  className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                >
                  {t('button.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div
        ref={cardRef}
        className="w-3/4 perspective-[1000px] transition-[height] duration-300 ease-in-out"
        style={{ height: cardHeight }}
      >
        <div
          className={`relative grid transition-transform duration-500 [transform-style:preserve-3d] ${
            flippedUser ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ height: cardHeight }}
        >
          {/* Front */}
          <div ref={frontRef} className="rounded-xl shadow-lg bg-[color:var(--secondary)] p-4 [backface-visibility:hidden] z-10">
            <div className="w-full flex flex-row">
                <div className="w-full flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">{t('users.users')}</h4>
                    <button
                        className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={addUser}
                    >
                    <span className="text-lg font-bold">+</span> {t('button.add')}
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
                  {tab === "enabled" ? t('users.enabled') : t('users.disabled')}
                </button>
              ))}
            </div>

            {/* Table */}
            {sortedUsers.length === 0 ? (
              <div className="py-6 text-center text-[color:var(--text)]">
                {t('users.no_users')}
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-[color:var(--divide)]">
                  <thead>
                    <tr>
                      <th 
                        className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                        onClick={() => handleSort("userName")}>
                        {t('users.name')} {sortConfig.key === "userName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th 
                        className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                        onClick={() => handleSort("roleName")}>
                        {t('users.role')} {sortConfig.key === "roleName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th 
                        className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                        onClick={() => handleSort("email")}>
                        {t('users.email')} {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y [color:var(--divide)]">
                    {sortedUsers.map((user) => (
                      <tr
                        key={user.idUser}
                        className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        onClick={() => setFlippedUser(user)}
                      >
                        <td className="w-1/2 py-2">{user.userName}</td>
                        <td className="w-1/2 py-2">
                          {user.roleName === "ROLE_ADMIN"
                            ? t('users.admin')
                            : user.roleName === "ROLE_ACCOUNTING"
                            ? t('users.accounting')
                            : user.roleName === "ROLE_USER"
                            ? t('users.user')
                            : user.roleName}
                          </td>
                        <td className="w-1/2 py-2">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Back */}
          <div ref={backRef} className="absolute inset-0 rounded-xl shadow-lg bg-[color:var(--primary)] text-[color:var(--text-light)] p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-[color:var(--secondary)] text-[color:var(--text)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--secondary-light-hover)] transition-colors duration-300"
            >
              ← {t('button.back')}
            </button>
            {flippedUser && (
              <div className="flex flex-col gap-2 ms-5">
                <h4 className="text-xl font-semibold mb-2">{flippedUser.userName}</h4>
                <p><strong>{t('users.plan')}:</strong> {flippedUser.planName}</p>
                <p><strong>{t('users.email')}:</strong> {flippedUser.email}</p>                
                {isEditing ? (
                  <>
                    {/* Select Role */}
                    <div>
                      <label className="block font-semibold mb-1">{t('users.role')}</label>
                      <select
                        value={editData.idRole}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, idRole: e.target.value }))
                        }
                        className="p-2 rounded-lg border text-[color:var(--text)]"
                      >
                        <option value={1}>{t('users.admin')}</option>
                        <option value={2}>{t('users.accounting')}</option>
                        <option value={3}>{t('users.user')}</option>
                      </select>
                    </div>

                    {/* Toggle Status */}
                    <div className="flex items-center gap-2">
                      <label className="font-semibold">{t('users.status')}: </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditData((prev) => ({ ...prev, enabled: !prev.enabled }))
                        }
                        className={`px-4 py-2 rounded-xl ${
                          editData.enabled
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {editData.enabled ? t('users.enabled') : t('users.disabled')}
                      </button>
                    </div>

                    {/* Buttons Save / Cancel */}
                    <div className="flex gap-2 justify-end mt-4 mb-4">
                      <button
                        onClick={handleCancelEdit}
                        className="mb-4 px-4 py-2 bg-[color:var(--secondary)] text-[color:var(--text)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--secondary-light-hover)] transition-colors duration-300"
                      >
                        {t('button.cancel')}
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="mb-4 px-4 py-2 bg-[color:var(--secondary)] text-[color:var(--text)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--secondary-light-hover)] transition-colors duration-300"
                      >
                        {t('button.save')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>{t('users.role')}: </strong> 
                      {flippedUser.roleName === "ROLE_ADMIN"
                            ? t('users.admin')
                            : flippedUser.roleName === "ROLE_ACCOUNTING"
                            ? t('users.accounting')
                            : flippedUser.roleName === "ROLE_USER"
                            ? t('users.user')
                            : flippedUser.roleName}
                    </p>
                    <p>
                      <strong>{t('users.status')}: </strong>
                      {flippedUser.enabled ? t('users.enabled') : t('users.disabled')}
                    </p>

                    <div className="flex justify-end mb-4">
                      <button
                        onClick={handleEdit}
                        className="mb-4 px-4 py-2 bg-[color:var(--secondary)] text-[color:var(--text)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--secondary-light-hover)] transition-colors duration-300"
                      >
                        {t('button.edit')}
                      </button>
                    </div>
                  </>
                )}
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
