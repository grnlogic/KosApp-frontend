import { useNavigate } from "react-router-dom";
import Kasur from "./asset/Kasur.svg";
import Brush from "./asset/Brush.svg";
import HelpCircle from "./asset/HelpCircle.svg";
import Kertas from "./asset/Kertas.svg";
import TOA from "./asset/TOA.svg";
import Money from "./asset/Money.svg";

const Beranda = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full text-center bg-[#FEBF00] p-6 shadow-lg rounded-b-[30px]">
        <h1 className="flex items-center justify-center text-center text-2xl py-8 text-white font-bold">
          Beranda Admin
        </h1>
      </div>

      {/* Tombol Navigasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <button
          onClick={() => navigate("/admin/edit-info-kamar")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={Kasur} alt="Kasur" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Kamar</p>
          </div>
          <p className="text-start mt-2">Kelola informasi dan status kamar</p>
        </button>

        <button
          onClick={() => navigate("/admin/edit-jadwal-kebersihan")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={Brush} alt="Brush" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Kebersihan</p>
          </div>
          <p className="text-start mt-2">Kelola jadwal kebersihan</p>
        </button>

        <button
          onClick={() => navigate("/admin/faq")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={HelpCircle} alt="Help Circle" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">FAQ</p>
          </div>
          <p className="text-start mt-2">Kelola FAQ</p>
        </button>

        <button
          onClick={() => navigate("/admin/edit-peraturan")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={Kertas} alt="Kertas" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Peraturan</p>
          </div>
          <p className="text-start mt-2">Edit peraturan</p>
        </button>

        <button
          onClick={() => navigate("/admin/edit-pengumuman")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={TOA} alt="TOA" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Pengumuman</p>
          </div>
          <p className="text-start mt-2">Edit pengumuman</p>
        </button>

        <button
          onClick={() => navigate("/admin/edit-pembayaran")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={Money} alt="Money" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Pembayaran</p>
          </div>
          <p className="text-start mt-2">Kelola pembayaran</p>
        </button>

        <button
          onClick={() => navigate("/admin/edit-akun-penghuni")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={TOA} alt="TOA" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Edit Akun</p>
          </div>
          <p className="text-start mt-2">Edit Akun Penghuni</p>
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full h-[130px] rounded-[8px] flex flex-col p-4 gap-y-2 bg-white border border-gray-200 box-border"
        >
          <div className="flex items-center">
            <img src={TOA} alt="TOA" className="w-6 h-6 mr-2" />
            <p className="font-extrabold">Log Out</p>
          </div>
          <p className="text-start mt-2">Keluar dari halaman</p>
        </button>
      </div>
    </div>
  );
};

export default Beranda;
