import { CheckCircleIcon } from "@heroicons/react/24/solid";

const infoKamar = () => {
  return (
    <div>
      <div className="bg-[#FEBF00] rounded shadow-custom">
        <div className="flex justify-start pl-4 pt-4">
          <h1 className="text-2xl text-white font-bold">Detail Kamar</h1>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">Nomor Kamar</p>
          <p className="text-1xl text-white font-medium ">1</p>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">Status Pembayaran</p>
          <p className="text-1xl text-[#82DEA4] font-medium ">Bayar</p>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8 pb-3">
          <p className="text-1xl text-white font-medium">Harga Sewa</p>
          <p className="text-1xl text-white font-bold">Rp 500.000/Bulan</p>
        </div>
      </div>


      <div className="bg-[#FEBF00] rounded shadow-custom mt-4">
        <div className="flex justify-start pl-4 pt-4">
          <h1 className="text-2xl text-white font-bold">Fasilitas</h1>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">AC</p>
          <CheckCircleIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">Kamar Mandi Dalam</p>
          <CheckCircleIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8 pb-3">
          <p className="text-1xl text-white font-medium">Wifi</p>
          <CheckCircleIcon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default infoKamar;
