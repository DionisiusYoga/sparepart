"use client";
import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Select,
  Input,
  Table,
  Popconfirm,
  Button,
  Skeleton,
  Tooltip,
  notification,
} from "antd";
import axios from "axios";
import Link from "next/link";

const Material = () => {
  const [nama, setNama] = useState("");
  const [sumber, setSumber] = useState([]);
  const [isExists, setIsExists] = useState(false);
  const [dataSumber, setDataSumber] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      title: "No.",
      width: 40,
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Nama",
      width: 320,
      dataIndex: "nama",
      key: "nama",
      align: "left",
    },
    {
      title: "Aksi",
      key: "Aksi",
      width: 80,
      align: "center",
      render: (record) => (
        <div className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
          <Link href={"/pengaturan/sumber/ubah/" + record.key}>
            <button
              className="inline-block border-e p-3 text-gray-700 hover:bg-emerald-200 focus:relative transition-colors"
              title="Ubah sumber"
            >
              <EditOutlined />
            </button>
          </Link>

          <Popconfirm
            placement="bottomRight"
            cancelText="Batal"
            okText="Hapus"
            title="Konfirmasi"
            description="Anda yakin ingin menghapus sumber ini?"
            onConfirm={() => handleDeleteSumber(record.key)}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
          >
            <button
              className="inline-block p-3 text-gray-700 hover:bg-red-200 focus:relative transition-colors"
              title="Hapus sumber"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const suffix = (
    <Tooltip title="Nama sumber sudah ada">
      <InfoCircleOutlined
        style={{
          color: isExists ? "rgba(255,0,0,1.0)" : "transparent",
          visibility: isExists ? "visible" : "hidden",
        }}
      />
    </Tooltip>
  );

  const handleTambahSumber = async (e) => {
    try {
      e.preventDefault();
      if (nama.trim() && nama.length !== 0) {
        const namaSudahAda = dataSumber.some(
          (sumberItem) =>
            sumberItem.nama_sumber.toLowerCase() === nama.toLowerCase()
        );

        if (!namaSudahAda) {
          const response = await axios.post("/api/sumber/tambah", {
            nama_sumber: nama,
          });

          if (response.status === 200) {
            notification.success({
              message: "Berhasil",
              description: "Sumber baru berhasil ditambahkan",
              placement: "top",
              duration: 5,
            });

            fetchSumber();
            setNama("");
            setIsExists(false);
          }
        } else {
          setIsExists(true);

          notification.error({
            message: "Gagal",
            description: "Sumber dengan nama tersebut sudah ada",
            placement: "top",
            duration: 3,
          });
        }
      }
    } catch (error) {
      console.error("Error add sub categories:", error);

      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah sumber",
        placement: "top",
        duration: 3,
      });
    }
  };

  const fetchSumber = async () => {
    try {
      const response = await axios.get("/api/sumber");
      const listData = response.data.rows;

      const mappedData = listData.map((data, index) => {
        return {
          key: data.id_sumber,
          no: index + 1,
          nama: data.nama_sumber,
        };
      });
      setDataSumber(listData);
      setSumber(mappedData);
    } catch (error) {
      console.error("Error fetching sumber:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSumber();
  }, []);

  const handleDeleteSumber = async (id) => {
    try {
      const response = await axios.post("/api/sumber/hapus", {
        id_sumber: id,
      });

      if (response.status === 200) {
        notification.success({
          message: "Berhasil",
          description: "Sumber berhasil dihapus",
          placement: "top",
          duration: 5,
        });

        fetchSumber();
      }
    } catch (error) {
      if (error.response?.data?.error === "FOREIGN_KEY_VIOLATION") {
        notification.error({
          message: "Tidak dapat menghapus sumber",
          description:
            "Sumber ini sedang digunakan dalam transaksi dan tidak dapat dihapus",
          placement: "top",
          duration: 5,
        });
      } else {
        notification.error({
          message: "Gagal",
          description: "Terjadi kesalahan saat menghapus sumber",
          placement: "top",
          duration: 3,
        });
      }
      console.error("Error deleting sumber:", error);
    }
  };

  return (
    <div>
      {/* <Notification pesan="Data berhasil diubah!" title="Berhasil" /> */}
      <div className="grid gap-10">
        <h1 className="text-2xl font-medium col-span-1">Kelola Material</h1>

        <div className="grid max-w-screen-xl px-4 gap-2">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-2 rows">
            <div className="h-16 rounded-lg lg:col-span-2 content-end">
              <div>
                <p className="block px-1 text-sm text-nowrap font-medium text-gray-700">
                  Nama Material
                </p>

                <Input
                  type="text"
                  id="namasumber"
                  value={nama}
                  placeholder="Masukkan nama sumber"
                  onChange={(e) => setNama(e.target.value)}
                  suffix={suffix}
                  status={isExists ? "error" : undefined}
                  className="mt-1 w-full h-10 rounded-md border-gray-200 shadow-sm sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="h-16 w-36 rounded-lg lg:content-end content-center">
              <button
                type="submit"
                onClick={handleTambahSumber}
                className="rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
              >
                Tambah material
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-screen-xl">
        <Table
          className="mt-4 shadow-md rounded-md"
          columns={columns}
          dataSource={sumber}
          size="middle"
          loading={isLoading}
          scroll={{
            x: 480,
            y: 512,
          }}
          pagination={{
            position: ["bottomCenter"],
            total: sumber.length,
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default Material;
