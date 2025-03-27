import { Link } from "react-router-dom";
import { Search, Home, MapPin, Coffee, Bed, ArrowRight } from "lucide-react";
import { Button, Input } from "../components/ui/ui";
import { useNavigate } from "react-router-dom";
import { LifeLine, ThreeDot } from "react-loading-indicators"; // Ensure this is the correct library or replace with the correct import

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 relative overflow-hidden pt-16">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-16 w-16 rounded-full bg-yellow-300 opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 h-24 w-24 rounded-full bg-yellow-200 opacity-50"></div>
      <div className="absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-amber-200 opacity-30"></div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-16">
        <div className="max-w-lg sm:max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 relative">
          {/* House illustration */}
          <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 bg-yellow-400 rounded-full h-24 w-24 sm:h-32 sm:w-32 flex items-center justify-center shadow-lg border-4 border-white">
            <div className="text-3xl sm:text-5xl font-bold text-white">404</div>
          </div>

          {/* Key decorative elements */}
          <div className="absolute -left-4 sm:-left-6 top-1/3 bg-yellow-300 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-md">
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
          </div>
          <div className="absolute -right-4 sm:-right-6 top-1/2 bg-yellow-300 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-md">
            <Bed className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
          </div>
          <div className="absolute -left-4 sm:-left-6 bottom-1/4 bg-yellow-300 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-md">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
          </div>
          <div className="mt-12 sm:mt-16 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-yellow-800 sm:text-4xl mb-2">
              Room Not Found
            </h1>

            <div className="h-1 w-16 sm:w-24 bg-yellow-400 mx-auto my-4 rounded-full"></div>

            <p className="text-yellow-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Waduh, sepertinya kamu nyasar! Halaman ini nggak ada. Yuk balik ke
              beranda!"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("LoginScreen")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-4 sm:py-6 h-auto rounded-xl shadow-md transition-transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span>Back to Home</span>
                </div>
              </Button>

              <Button className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 px-4 sm:px-6 py-4 sm:py-6 h-auto rounded-xl shadow-sm">
                <Link to="/rooms" className="flex items-center gap-2">
                  <span>Explore Our Rooms</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-yellow-700 text-xs sm:text-sm">
            Need assistance?{" "}
            <Link
              to="/contact"
              className="text-yellow-600 font-medium hover:underline"
            >
              Contact our friendly staff
            </Link>
          </p>

          <ThreeDot
            variant="bounce"
            color="#e1d834"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      </div>
    </div>
  );
}
