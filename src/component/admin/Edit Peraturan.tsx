import React, { useState, useEffect } from "react";
import { Pencil, Trash, Plus, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

type Rule = {
  id: number;
  title: string;
  description: string;
};

const EditPeraturan: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [mode, setMode] = useState<"list" | "edit" | "create">("list");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch rules from backend
  useEffect(() => {
    fetch("https://manage-kost-production.up.railway.app/api/peraturan")
      .then((res) => res.json())
      .then((data) =>
        setRules(
          data.map((item: any) => ({
            id: item.id,
            title: item.judul_peraturan,
            description: item.deskripsi_peraturan,
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch rules:", err));
  }, []);

  const handleEdit = (rule: Rule) => {
    setSelectedRule(rule);
    setTitle(rule.title);
    setDescription(rule.description);
    setMode("edit");
  };

  const handleAddNew = () => {
    setSelectedRule(null);
    setTitle("");
    setDescription("");
    setMode("create");
  };

  const handleSave = () => {
    const token = localStorage.getItem("authToken");
    console.log("Using token:", token); // Debug output

    const method = mode === "edit" ? "PUT" : "POST";
    const url =
      mode === "edit"
        ? `https://manage-kost-production.up.railway.app/api/peraturan/${selectedRule?.id}`
        : "https://manage-kost-production.up.railway.app/api/peraturan";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        judul_peraturan: title,
        deskripsi_peraturan: description,
      }),
    })
      .then(() => {
        // Refresh rules after saving
        return fetch(
          "https://manage-kost-production.up.railway.app/api/peraturan"
        )
          .then((res) => res.json())
          .then((data) =>
            setRules(
              data.map((item: any) => ({
                id: item.id,
                title: item.judul_peraturan,
                description: item.deskripsi_peraturan,
              }))
            )
          );
      })
      .then(() => {
        Swal.fire("Berhasil!", "Peraturan berhasil disimpan.", "success");
      })
      .catch((err) => {
        console.error("Failed to save rule:", err);
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat menyimpan peraturan.",
          "error"
        );
      });

    setMode("list");
  };

  const handleDelete = () => {
    if (selectedRule) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Peraturan yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(
            `https://manage-kost-production.up.railway.app/api/peraturan/${selectedRule.id}`,
            {
              method: "DELETE",
            }
          )
            .then(() => {
              // Refresh rules after deletion
              return fetch(
                "https://manage-kost-production.up.railway.app/api/peraturan"
              )
                .then((res) => res.json())
                .then((data) =>
                  setRules(
                    data.map((item: any) => ({
                      id: item.id,
                      title: item.judul_peraturan,
                      description: item.deskripsi_peraturan,
                    }))
                  )
                );
            })
            .then(() => {
              Swal.fire("Berhasil!", "Peraturan berhasil dihapus.", "success");
            })
            .catch((err) => {
              console.error("Failed to delete rule:", err);
              Swal.fire(
                "Gagal!",
                "Terjadi kesalahan saat menghapus peraturan.",
                "error"
              );
            });
        }
      });
    }
    setMode("list");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-6">
      {/* Search and Add */}
      {mode === "list" && (
        <div className="flex items-center gap-2 mt-6">
          <input
            type="text"
            placeholder="🔍 Cari peraturan..."
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Tambah
          </button>
        </div>
      )}

      {/* List Mode */}
      {mode === "list" && (
        <div className="space-y-4 mt-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-4 rounded-lg shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{rule.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(rule)}>
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRule(rule);
                      handleDelete();
                    }}
                  >
                    <Trash size={16} color="#f43f5e" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rule.description}</p>
            </div>
          ))}

          {/* Pagination (dummy) */}
          <div className="flex justify-center items-center gap-2 pt-4">
            <button className="text-gray-400">{`<`}</button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded-full ${
                  n === 1 ? "bg-black text-white" : "bg-white text-gray-500"
                }`}
              >
                {n}
              </button>
            ))}
            <button className="text-gray-400">{`>`}</button>
          </div>
        </div>
      )}

      {/* Form Edit & Create */}
      {(mode === "edit" || mode === "create") && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="font-semibold">Judul Peraturan</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-semibold">Deskripsi Peraturan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 text-sm min-h-[100px]"
            />
          </div>
          <div>
            <label className="font-semibold">Pratinjau Peraturan</label>
            <div className="bg-gray-100 rounded-lg p-4 mt-1 text-sm space-y-1">
              <h4 className="font-bold">{title || "..."}</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {description || "..."}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              className="bg-gray-200 text-black px-4 py-2 rounded-lg"
              onClick={() => setMode("list")}
            >
              Batal
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleDelete}
              disabled={mode === "create"}
            >
              Hapus
            </button>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg"
              onClick={handleSave}
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPeraturan;
