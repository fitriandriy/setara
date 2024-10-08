import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { CombinedItem } from '../../../types/Home';
import FavoriteLoading from '../../FavoriteLoading';
import { useAuth } from '../../../hooks/useAuth';
import { Autoplay, Navigation } from 'swiper/modules';
import { ArrowCircleLeft, ArrowCircleRight } from '@phosphor-icons/react';
import iconTransFav from '/images/homepage/icon-trans-fav.png';
import iconTopupFav from '/images/homepage/icon-ewallet-fav2.png';

export const FavoriteTransaction: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const [response1, response2] = await Promise.all([
        axios.get<{
          data: { favorites: CombinedItem[] };
        }>(`${process.env.VITE_API_URL}/saved-accounts`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          timeout: 5000,
        }),
        axios.get<{
          data: { favorites: CombinedItem[] };
        }>(`${process.env.VITE_API_URL}/saved-ewallet-users`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          timeout: 5000,
        }),
      ]);

      const favoritesWithType = response1.data.data.favorites.map(
        (account) => ({
          ...account,
          type: 'transfer' as const,
        })
      );

      const savedEwalletUsersWithType = response2.data.data.favorites.map(
        (ewalletUser) => ({
          ...ewalletUser,
          type: 'topup' as const,
        })
      );

      const combinedData: CombinedItem[] = [
        ...favoritesWithType,
        ...savedEwalletUsersWithType,
      ];

      setFavorites(combinedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setErrorMessage('Belum ada transaksi akun favorit.');
        } else {
          setErrorMessage('Terjadi kesalahan dalam pengambilan data.');
        }
      } else {
        setErrorMessage('Terjadi kesalahan yang tidak terduga.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return <FavoriteLoading />;
  }

  if (errorMessage) {
    return (
      <p className="text-primary-100 text-body-large font-semibold">
        {errorMessage}
      </p>
    );
  }

  if (favorites.length === 0) {
    return (
      <p tabIndex={0} aria-label='No favorite transactions found' className="text-primary-100 text-body-large font-semibold">
        No favorite transactions found.
      </p>
    );
  }

  return (
    <div>
      <div className="py-3">
        <Swiper
          modules={[Navigation, Autoplay]}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={15}
          slidesPerView={1.5}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {favorites.map((transaction) => (
            <SwiperSlide key={transaction.id}>
              <div tabIndex={0}
                className="border border-primary-300 shadow-lg rounded-lg xl:p-7 p-4"
                role="group"
                aria-label={`Transaksi favorit: ${
                  transaction.type === 'transfer' ? 'Transfer' : 'Top Up'
                }`}
              >
                <div
                  className={`flex gap-2 items-center py-1 px-2 w-20 bg-primary-100 rounded-3xl text-white text-caption-large`}
                >
                  <img
                    src={
                      transaction.type === 'transfer'
                        ? iconTransFav
                        : iconTopupFav
                    }
                    alt={
                      transaction.type === 'transfer'
                        ? 'Ikon transfer favorit'
                        : 'Ikon topup favorit'
                    }
                    className="w-[10px] h-[10px]"
                  />
                  <p className="text-caption-small">
                    {transaction.type === 'transfer' ? 'Transfer' : 'Top Up'}
                  </p>
                </div>
                <h5 className="xl:text-body-large text-body-small pt-3 capitalize">
                  {transaction.type === 'transfer'
                    ? 'Transfer Antar BCA'
                    : `Top Up ${transaction.ewallet_name}`}
                </h5>
                <h5 className="text-primary-100 xl:text-heading-6 text-body-small font-semibold">
                  {transaction.type === 'transfer'
                    ? transaction.account_name
                    : transaction.ewallet_user_name}
                </h5>
              </div>
            </SwiperSlide>
          ))}
          <div className="md:flex justify-center gap-3 pt-4 hidden">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="text-gray-500 hover:text-primary-100 focus:text-primary-100 transition-colors duration-300"
              aria-label="Slide sebelumnya"
              aria-controls="swiper-container"
              role="button"
            >
              <ArrowCircleLeft size={35} aria-hidden="true" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="text-gray-500 hover:text-primary-100 focus:text-primary-100 transition-colors duration-300"
              aria-label="Slide berikutnya"
              aria-controls="swiper-container"
              role="button"
            >
              <ArrowCircleRight size={35} aria-hidden="true" />
            </button>
          </div>
        </Swiper>
      </div>
    </div>
  );
};
