import { Card } from "antd"
import Breadcrumb from "../../components/Breadcumb"
import { useParams } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData";
import { useAuth } from "../../hooks/useAuth";
import { FormatCurrency } from "../../utils";

type TransactionDetail = {
  sender: {
    name: string;
    account_number: string;
    image_path: string;
    vendor_name: string;
  };
  receiver: {
    name: string;
    account_number: string;
    image_path: string;
    vendor_name: string;
  };
  amount: number;
  admin_fee: number;
  total_amount: number;
};

const BuktiTransfer = () => {

  const { id } = useParams<{ id: string }>();
  console.log(id)
  const { user } = useAuth()
  const { data, isLoading } = useFetchData<TransactionDetail>(`/transactions/get-mutation-detail/${id}`, user?.token)
  console.log(data)
  return (
    <div className="container py-5 lg:py-[50px] pb-[50px]">
      <Breadcrumb
        title="Bukti Transfer"
        subtitle="Periksa Rincian Keuangan Anda"
      />
      <div className="lg:flex">
        <img className="w-[200px] lg:w-[521px] mx-auto my-4" src="/images/check-data.png" alt="" />
        <Card className="p-5 lg:w-[45%] text-primary-100 shadow-lg">
          <div>
            <p className="font-bold">Pengirim</p>
            <div className="flex items-center mt-2">
              <img className="w-[70px] mr-4" src={data?.sender.image_path} alt="" />
              <div>
                <p className="font-bold">{data?.sender.name}</p>
                <div className="flex items-center">
                  <p>{data?.sender.vendor_name}</p>
                  <img className="w-[6px] h-[6px] mx-2" src="/images/icons/dot.png"></img>
                  <p>{data?.sender.account_number}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 mb-5">
            <p className="font-bold mb-2">Penerima</p>
            <div className="flex items-center">
              <img className="w-[70px] mr-4" src={data?.receiver.image_path} alt="" />
              <div>
                <p className="font-bold">{data?.receiver.name}</p>
                <div className="flex items-center">
                  <p>{data?.receiver.vendor_name}</p>
                  <img className="w-[6px] h-[6px] mx-2" src="/images/icons/dot.png"></img>
                  <p>{data?.receiver.account_number}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="font-bold">Detail</p>
          <div className='flex justify-between mt-4'>
            <div className="text-neutral-300 font-normal">
              <p>Nominal Top Up</p>
              <p>Biaya Admin</p>
              <p>Catatan</p>
            </div>
            <div>
              <p>{FormatCurrency(data?.amount)}</p>
              <p>{FormatCurrency(data?.admin_fee)}</p>
              <p>{'-'}</p>
            </div>
          </div>
          <hr className='border-neutral-300 my-2' />
          <div className='flex justify-between font-bold'>
            <p>Total</p>
            <p>{FormatCurrency(data?.total_amount)}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default BuktiTransfer
