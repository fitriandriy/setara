import React, { useState } from "react";
import { Button, Card, Flex, Form, FormProps, Input } from "antd";
import "./style.css";
import { useNavigate } from "react-router-dom";
import CustomerItem from "../CustomerItem";

type TDestinationNumber = number;

type TContact = {
  name: string;
  type: string;
  number: string;
  isFavorite?: boolean;
  avatar: string;
};

interface PropsDestinationNumber {
  pathUrl: string;
  contacts: { name: string; type: string; number: string; isFavorite?: boolean; avatar: string }[];
}

const DestinationNumber: React.FC<PropsDestinationNumber> = ({ pathUrl, contacts }) => {
  const [filteredContact, setFilteredContact] = useState<TContact[] | []>([]);

  const navigate = useNavigate();

  const onFinish: FormProps<TDestinationNumber>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<TDestinationNumber>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setFilteredContact([]);
    } else {
      const filterContact = contacts.filter((contact) => contact.number.includes(e.target.value));
      setFilteredContact(filterContact);
    }
  };

  return (
    <Card className="w-full border-white md:border-primary-300">
      <Button
        className="bg-primary-100 text-white w-full h-10 rounded-xl mb-3 font-semibold text-body-small md:mb-6 md:text-heading-6 md:h-[60px]"
        onClick={() => navigate(`${pathUrl}/nomor-tujuan-baru`)}
      >
        Transfer ke Tujuan Baru
      </Button>
      <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item
          name="destinationNumber"
          label="Nomor Tujuan"
          className="mb-0"
          rules={[{ required: true, message: "Nomor Tidak Boleh Kosong" }]}
          required
        >
          <Input type="number" placeholder="Cari Nomor Tujuan" onChange={handleSearch} />
        </Form.Item>
      </Form>

      <Flex className="mt-6" gap={12} vertical>
        {filteredContact.map((contact, index) => (
          <Card
            id="contact-item"
            className="border-white lg:border-primary-300"
            onClick={() => navigate(`${pathUrl}/nominal-topup`)}
          >
            <CustomerItem {...contact} key={index} />
          </Card>
        ))}
      </Flex>
    </Card>
  );
};

export default DestinationNumber;
