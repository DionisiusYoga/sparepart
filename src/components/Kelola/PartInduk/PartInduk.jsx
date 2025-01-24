"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Avatar,
  Card,
  Badge,
  Flex,
  Switch,
  Button,
  Progress,
  Col,
  DatePicker,
  Popconfirm,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Divider,
  List,
  Spin,
  Empty,
  Result,
  Table,
  notification,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import dayjs from "dayjs";

const PartInduk = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCard, setLoadingCard] = useState(true);
  const [open, setOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedAnggaran, setSelectedAnggaran] = useState(null);
  const [statusCheck, setStatusCheck] = useState(true);

  const [form] = useForm();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [jumlahAnggaran, setJumlahAnggaran] = useState("");

  const [transaksiAnggaran, setTransaksiAnggaran] = useState("");

  const router = useRouter();
  const { Option } = Select;

  const columns = [
    {
      title: "No.",
      width: 10,
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Nama",
      width: 40,
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Tanggal",
      width: 30,
      dataIndex: "tanggal",
      key: "tanggal",
    },
    {
      title: "Kategori",
      dataIndex: "kategori",
      key: "kategori",
      width: 30,
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
      width: 20,
      render: (text, record) => (
        <span className="text-nowrap" style={{ color: "red" }}>
          - {record.jumlah}
        </span>
      ),
    },
  ];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const delayLoading = async () => {
    try {
      setLoadingCard(true);
      await delay(3000);
    } catch (error) {
      console.error("Error during delay:", error);
    } finally {
      setLoadingCard(false);
    }
  };

  const DescriptionItem = ({ title, content }) => (
    <div className="mb-2 text-sm text-gray-800 leading-relaxed">
      <div className="inline-block text-gray-600 mr-2">{title}:</div>
      <div className="font-semibold text-lg mb-2">{content}</div>
    </div>
  );

  const showEditDrawer = (anggaran) => {
    setSelectedAnggaran(anggaran);
    // Set initial values untuk form edit
    editForm.setFieldsValue({
      nama: anggaran.nama_anggaran,
      jumlah: Number(anggaran.total_anggaran).toLocaleString("id-ID"),
      periode: [dayjs(anggaran.tanggal_awal), dayjs(anggaran.tanggal_akhir)],
      catatan: anggaran.catatan || "",
      status: anggaran.status === "Aktif" ? true : false,
    });
    setEditDrawerOpen(true);
  };

  // Handler untuk menutup drawer edit
  const onEditDrawerClose = () => {
    setEditDrawerOpen(false);
    setSelectedAnggaran(null);
    editForm.resetFields();
  };

  const showDetailDrawer = (anggaran) => {
    setSelectedAnggaran(anggaran);
    fetchTransaksiAnggaran(anggaran.id_anggaran);
    setDetailDrawerOpen(true);
  };

  // Handler untuk menutup drawer detail
  const onDetailDrawerClose = () => {
    setDetailDrawerOpen(false);
    setSelectedAnggaran(null);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const actions = [
    <EditOutlined key="edit" />,
    <DeleteOutlined key="delete" />,
  ];

  const getStrokeColor = (percent) => {
    if (percent >= 100) return "#ff6565"; // Warna ketika 100%
    if (percent >= 60) return "#ffcc65"; // Warna ketika >= 60%
    if (percent >= 30) return "#efff65"; // Warna ketika >= 30%
    return "#a1ff65"; // Warna default atau ketika kurang dari 30%
  };

  // const handleAddCard = () => {
  //   setCards([...cards, cards.length + 1]); // Menambahkan Card baru ke daftar
  // };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Menggunakan regex untuk menambahkan titik sebagai pemisah ribuan
  };

  const handleJumlahChange = (e) => {
    const inputValue = e.target.value.replace(/\./g, ""); // Menghapus titik dari input
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Mengambil hanya angka

    if (numericValue.length <= 12) {
      const formattedValue = formatNumber(numericValue); // Mengformat angka
      setJumlahAnggaran(formattedValue); // Memperbarui state dengan nilai yang diformat
    }
  };

  return (
    <div>
      <Drawer
        // title="Buat Anggaran"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={<p className="text-lg font-bold">Buat Anggaran</p>}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <Space>
              <button
                type="button"
                onClick={onClose}
                className="max-w-44 text-wrap rounded border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => form.submit()}
                type="button"
                className="min-w-36 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
              >
                Simpan
              </button>
            </Space>
          </div>
        }
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nama"
                label="Nama Anggaran"
                rules={[
                  {
                    required: true,
                    message: "Isi field ini terlebih dahulu!",
                  },
                ]}
              >
                <Input
                  type="text"
                  id="nama"
                  placeholder="Masukkan nama anggaran"
                  style={{
                    minHeight: 39,
                  }}
                  // value={jumlahTransaksi}
                  // onChange={handleJumlahChange}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  required
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jumlah"
                label="Jumlah"
                rules={[
                  {
                    required: true,
                    message: "Isi field ini terlebih dahulu!",
                  },
                ]}
                getValueFromEvent={(e) => {
                  const inputValue = e.target.value.replace(/\./g, "");
                  const numericValue = inputValue.replace(/[^0-9]/g, "");
                  return formatNumber(numericValue);
                }}
              >
                <Input
                  type="text"
                  prefix="Rp"
                  placeholder="0"
                  style={{ minHeight: 39 }}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  maxLength={16}
                  required
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="periode"
                label="Periode"
                rules={[
                  {
                    required: true,
                    message: "Silakan pilih periode terlebih dahulu!",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  format={"DD MMMM YYYY"}
                  getPopupContainer={(trigger) => trigger.parentElement}
                  placeholder={["Tanggal awal", "Tanggal akhir"]}
                  style={{
                    minHeight: 39,
                  }}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="catatan"
                label="Catatan (opsional)"
                rules={[
                  {
                    required: false,
                    message: "Masukkan catatan jika diperlukan",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Masukkan catatan jika diperlukan"
                  maxLength={256}
                  autoSize={{ maxRows: 6, minRows: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Drawer
        width={1024}
        placement="right"
        closable={true}
        onClose={onDetailDrawerClose}
        open={detailDrawerOpen}
        extra={<p className="font-bold text-lg">Detail Anggaran</p>}
      >
        {selectedAnggaran && (
          <>
            <p className="font-semibold text-lg pb-2">Progres Anggaran</p>
            <Row>
              <Col span={24}>
                <div className="flex justify-center my-2">
                  <div className="w-full max-w-lg">
                    {" "}
                    {/* Maksimalkan lebar div untuk konten */}
                    <Progress
                      // type="dashboard"
                      percent={Math.round(
                        ((selectedAnggaran.total_anggaran -
                          selectedAnggaran.sisa_anggaran) /
                          selectedAnggaran.total_anggaran) *
                          100
                      )}
                      percentPosition={{
                        align: "center",
                        type: "inner",
                      }}
                      strokeColor={getStrokeColor(
                        Math.round(
                          ((selectedAnggaran.total_anggaran -
                            selectedAnggaran.sisa_anggaran) /
                            selectedAnggaran.total_anggaran) *
                            100
                        )
                      )}
                      format={(percent) => (
                        <span
                          style={{ color: percent < 50 ? "black" : "white" }}
                        >
                          {percent === 100 ? "Maks" : `${percent}%`}
                        </span>
                      )}
                      strokeLinecap="round"
                      size={[500, 60]}
                      status={
                        Math.round(
                          ((selectedAnggaran.total_anggaran -
                            selectedAnggaran.sisa_anggaran) /
                            selectedAnggaran.total_anggaran) *
                            100
                        ) < 100
                          ? "active"
                          : "exception"
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />
            <p className="font-semibold text-lg pb-4">Informasi Anggaran</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Nama Anggaran"
                  content={selectedAnggaran.nama_anggaran}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Total Anggaran"
                  content={`Rp ${Number(
                    selectedAnggaran.total_anggaran
                  ).toLocaleString("id-ID")}`}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Sisa Anggaran"
                  content={`Rp ${Math.abs(
                    Number(selectedAnggaran.sisa_anggaran)
                  ).toLocaleString("id-ID")}`}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Status"
                  content={
                    <div className="flex gap-2 pl-1">
                      <Badge
                        status={
                          selectedAnggaran.sisa_anggaran < 0
                            ? "danger"
                            : "processing"
                        }
                        text=""
                        color={
                          selectedAnggaran.sisa_anggaran < 0 ? "red" : "green"
                        }
                      />
                      {selectedAnggaran.sisa_anggaran < 0
                        ? "Melebihi Anggaran"
                        : "Dalam Batas"}
                    </div>
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Tanggal Mulai"
                  content={dayjs(selectedAnggaran.tanggal_awal).format(
                    "DD MMMM YYYY"
                  )}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Tanggal Berakhir"
                  content={dayjs(selectedAnggaran.tanggal_akhir).format(
                    "DD MMMM YYYY"
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Catatan"
                  content={selectedAnggaran.catatan}
                />
              </Col>
            </Row>

            <Divider />
            <p className="font-semibold text-lg pb-2">Transaksi Anggaran</p>
            <Row>
              <div className="py-2 ">
                <Table
                  columns={columns}
                  dataSource={transaksiAnggaran}
                  className="rounded-md shadow-md w-full"
                  size="middle"
                  loading={loading}
                  scroll={{
                    x: 480,
                    y: 160,
                  }}
                  pagination={{
                    position: ["bottomCenter"],
                    total: transaksiAnggaran.length,
                    responsive: true,
                  }}
                />
              </div>
            </Row>
          </>
        )}
      </Drawer>

      <Drawer
        width={720}
        onClose={onEditDrawerClose}
        open={editDrawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={<p className="font-bold text-lg">Ubah Anggaran</p>}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <Space>
              <button
                type="button"
                onClick={onEditDrawerClose}
                className="max-w-44 text-wrap rounded border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => editForm.submit()}
                type="button"
                className="min-w-36 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
              >
                Simpan Perubahan
              </button>
            </Space>
          </div>
        }
      >
        <Form layout="vertical" onFinish={handleEdit} form={editForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nama"
                label="Nama Anggaran"
                rules={[
                  {
                    required: true,
                    message: "Isi field ini terlebih dahulu!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Masukkan nama anggaran"
                  style={{
                    minHeight: 39,
                  }}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  required
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jumlah"
                label="Jumlah"
                rules={[
                  {
                    required: true,
                    message: "Isi field ini terlebih dahulu!",
                  },
                ]}
                getValueFromEvent={(e) => {
                  const inputValue = e.target.value.replace(/\./g, "");
                  const numericValue = inputValue.replace(/[^0-9]/g, "");
                  return formatNumber(numericValue);
                }}
              >
                <Input
                  type="text"
                  prefix="Rp"
                  placeholder="0"
                  style={{ minHeight: 39 }}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  maxLength={16}
                  required
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="periode"
                label="Periode"
                rules={[
                  {
                    required: true,
                    message: "Silakan pilih periode terlebih dahulu!",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  format={"DD MMMM YYYY"}
                  getPopupContainer={(trigger) => trigger.parentElement}
                  placeholder={["Tanggal awal", "Tanggal akhir"]}
                  style={{
                    minHeight: 39,
                  }}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="catatan"
                label="Catatan (opsional)"
                rules={[
                  {
                    required: false,
                    message: "Masukkan catatan jika diperlukan",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Masukkan catatan jika diperlukan"
                  maxLength={256}
                  autoSize={{ maxRows: 6, minRows: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: false,
                    message: "Pilih status aktif",
                  },
                ]}
              >
                <Switch
                  style={{ marginTop: "-12px" }}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={editForm.status === "Aktif" ? true : false}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <div className="grid gap-10 p-4">
        <h1 className="text-2xl font-medium col-span-1">Kelola Part Induk</h1>
        <div className="grid gap-2">
          <button
            onClick={showDrawer}
            type="submit"
            className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
          >
            Tambah Part
          </button>

          <Tabs
            animated={true}
            defaultActiveKey="1"
            centered
            items={[
              <Spin spinning={loading} style={{ marginTop: "36px" }}>
                {cards.filter((anggaran) => anggaran.status === "Aktif")
                  .length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                    {cards
                      .filter((anggaran) => anggaran.status === "Aktif")
                      .map((anggaran) => {
                        const {
                          id_anggaran,
                          nama_anggaran,
                          total_anggaran,
                          sisa_anggaran,
                          tanggal_awal,
                          tanggal_akhir,
                          catatan,
                        } = anggaran;

                        // Hitung persentase penggunaan anggaran
                        const percent = Math.round(
                          ((total_anggaran - sisa_anggaran) / total_anggaran) *
                            100
                        );

                        return (
                          <Card
                            key={id_anggaran}
                            loading={loadingCard}
                            className="w-full max-w-md"
                            style={{
                              minWidth: "230px",
                              maxWidth: "360px",
                            }}
                            hoverable={true}
                            onClick={() => showDetailDrawer(anggaran)}
                            actions={[
                              <Button
                                style={{ width: "80%" }}
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click event
                                  showEditDrawer(anggaran);
                                }}
                                type="text"
                                key="edit"
                              />,
                              <div onClick={(e) => e.stopPropagation()}>
                                <Popconfirm
                                  placement="bottom"
                                  cancelText="Batal"
                                  okText="Hapus"
                                  title="Konfirmasi"
                                  description="Anda yakin ingin menghapus anggaran ini?"
                                  onConfirm={() =>
                                    handleDelete(anggaran.id_anggaran)
                                  }
                                  icon={
                                    <QuestionCircleOutlined
                                      style={{
                                        color: "red",
                                      }}
                                    />
                                  }
                                >
                                  <Button
                                    style={{ width: "80%" }}
                                    icon={<DeleteOutlined />}
                                    type="text"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Stop propagation here
                                    }}
                                    danger
                                    key="delete"
                                  />
                                </Popconfirm>
                              </div>,
                            ]}
                          >
                            <div className="flex justify-center mb-4">
                              <Progress
                                type="dashboard"
                                percent={percent}
                                strokeColor={getStrokeColor(percent)}
                                format={(percent) =>
                                  percent === 100 ? "Maks" : `${percent}%`
                                }
                                strokeLinecap="round"
                                strokeWidth={12}
                                size={160}
                                status={percent < 100 ? "active" : "exception"}
                              />
                            </div>
                            <Card.Meta
                              title={nama_anggaran}
                              description={
                                <div>
                                  <div className="flex items-end gap-1.5">
                                    <h1
                                      className={`font-bold text-2xl ${
                                        sisa_anggaran < 0
                                          ? "text-red-500"
                                          : "text-emerald-500"
                                      }`}
                                    >
                                      Rp{" "}
                                      {Math.abs(
                                        Number(sisa_anggaran)
                                      ).toLocaleString("id-ID")}
                                    </h1>
                                    <h1 className="font-medium text-xl">
                                      {sisa_anggaran < 0 ? "lebih" : "lagi"}
                                    </h1>
                                  </div>
                                  <div className="flex items-end gap-1.5">
                                    <h1 className="font-medium text-xl">
                                      dari
                                    </h1>
                                    <h1 className="font-medium text-xl">
                                      Rp{" "}
                                      {Number(total_anggaran).toLocaleString(
                                        "id-ID"
                                      )}
                                    </h1>
                                  </div>
                                  <div className="flex justify-start mt-4">
                                    <span className="text-sm text-gray-700">
                                      Periode:
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span className="text-sm text-gray-500">
                                      {dayjs(tanggal_awal).format(
                                        "DD MMMM YYYY"
                                      )}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {dayjs(tanggal_akhir).format(
                                        "DD MMMM YYYY"
                                      )}
                                    </span>
                                  </div>
                                </div>
                              }
                            />
                          </Card>
                        );
                      })}
                  </div>
                ) : !loading ? (
                  <Result
                    status="404"
                    title="Data tidak ada!"
                    subTitle="Tidak ada Anggaran dalam status Aktif"
                  />
                ) : null}
              </Spin>,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PartInduk;
