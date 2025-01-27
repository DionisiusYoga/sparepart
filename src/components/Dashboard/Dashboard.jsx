"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Flex,
  Table,
  Card,
  List,
  Typography,
  Badge,
  Pagination,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "../../app/globals.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spreadsheet from "react-spreadsheet";
import ExcelJS from "exceljs";

const { Text } = Typography;

const Dashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);

  const [visible, setVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [partName, setPartName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");

  const [dataDraft, setDataDraft] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 4;

  const router = useRouter();

  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = () => {
    setVisible(false);
  };

  const jsonData = [
    {
      "PART NO.": ": " + partNo,
      "PART NAME": ": " + partName,
      CUSTOMER: ": " + customerName,
      PROJECT: ": " + project,
      "REVISI / DATE": ": " + date,
    },
  ];

  const headers = [
    "PART NO.",
    "PART NAME",
    "CUSTOMER",
    "PROJECT",
    "REVISI / DATE",
  ];

  const spreadsheetData = headers.map((header) => [
    { value: header },
    { value: jsonData[0][header] || "" },
  ]);

  const [data, setData] = useState(spreadsheetData);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.addRow([]);

    worksheet.columns = [
      { header: "Field", key: "field", width: 25 },
      { header: "Value", key: "value", width: 40 },
    ];

    spreadsheetData.forEach((row, rowIndex) => {
      worksheet.getCell(`A${rowIndex + 1}`).value = row[0].value;
      worksheet.getCell(`B${rowIndex + 1}`).value = row[1].value;

      // Styling
      worksheet.getCell(`A${rowIndex + 1}`).font = { bold: true };
      worksheet.getCell(`A${rowIndex + 1}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
      worksheet.getCell(`B${rowIndex + 1}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
      worksheet.getCell(`A${rowIndex + 1}`).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      worksheet.getCell(`B${rowIndex + 1}`).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      // Highlight header
      if (rowIndex === 0) {
        worksheet.getCell(`A${rowIndex + 1}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" },
        };
        worksheet.getCell(`B${rowIndex + 1}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" },
        };
      }
    });

    worksheet.addRow([]);

    const draftColumnHeaders = worksheet.addRow([
      "FUNCTION",
      "PART NO INDUK",
      "Update Sub Part No based on Seppen",
      "PART NO ANAK",
      "Update Sub Part No based on Seppen",
      "PART NAME",
      "PART NO CMW",
      "DWG SUPPLIER",
      "MATERIAL",
      "IMPOR",
      "LOKAL",
      "PART NO",
      "MAKER",
      "REMARK",
    ]);
    draftColumnHeaders.font = { bold: true };

    worksheet.columns = [
      { width: 15 }, // PART NO INDUK
      { width: 25 }, // PART NO INDUK
      { width: 40 }, // Update Sub Part No
      { width: 30 }, // PART NAME
      { width: 40 }, // Update Sub Part No
      { width: 30 }, // PART NAME
      { width: 25 }, // PART NO CMW
      { width: 20 }, // DWG SUPPLIER
      { width: 35 }, // MATERIAL
      { width: 15 }, // IMPOR
      { width: 15 }, // LOKAL
      { width: 25 }, // PART NO
      { width: 15 }, // MAKER
      { width: 15 }, // REMARK
    ];

    draftColumnHeaders.height = 25;
    draftColumnHeaders.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ccffff" }, // Light blue color
      };
    });

    const usedNoPartInduk = new Set();

    dataDraft.forEach((draft) => {
      const noPartInduk = usedNoPartInduk.has(draft.no_part_induk)
        ? " "
        : draft.no_part_induk || "-";

      if (noPartInduk !== "-") {
        usedNoPartInduk.add(noPartInduk);
      }

      worksheet.addRow([
        "",
        noPartInduk,
        draft.no_part_induk_update || "-",
        draft.no_part || "-",
        draft.no_part_update || "-",
        draft.nama || "-",
        draft.no_cmw || "-",
        draft.nama_dwg || "-",
        draft.nama_material || "-",
        draft.nama_impor || "-",
        draft.nama_lokal || "-",
        draft.no_cmw || "-",
        draft.nama_maker || "-",
        "",
      ]);
    });

    // Style and formatting for draft section
    const lastRowIndex = worksheet.rowCount;
    for (let i = spreadsheetData.length + 3; i <= lastRowIndex; i++) {
      const row = worksheet.getRow(i);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const now = new Date();
    const formattedDate = now
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ""); // Format: DDMMYYYY

    const formattedTime = now
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/:/g, ""); // Format: HHMMSS

    const fileName = `laporan-${formattedDate}-${formattedTime}.xlsx`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchPartInduk = async () => {
    try {
      const response = await axios.get("/api/partinduk");
      const partindukData = response.data.rows.map((row, index) => ({
        key: row.id_pi,
        nomor_pi: row.no_part,
        nomor_pi_update: row.no_part_update,
      }));
      setInitialData(partindukData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaporan = async () => {
    console.log("Customer Name:", customerName);
    console.log("Part Name:", partName);
    console.log("Part No.:", partNo);
    console.log("Project:", project);
    console.log("Date:", date);

    try {
      exportToExcel();
    } catch (error) {
      console.error("Error generate laporan: ", error);
    }
  };

  const fetchDataDraft = async () => {
    try {
      const response = await axios.get("/api/draftlaporan/generate");
      setDataDraft(response.data.rows);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataDraft();
  }, []);

  const fetchDraftLaporan = async () => {
    try {
      const response = await axios.get("/api/draftlaporan");
      setCartItems(response.data.rows);

      const selectedKeys = response.data.rows
        .map((item) => {
          const matchingRow = initialData.find(
            (row) => row.nomor_pi === item.no_part
          );
          return matchingRow ? matchingRow.key : null;
        })
        .filter((key) => key !== null);

      setSelectedRowKeys(selectedKeys);
    } catch (error) {
      console.error("Error fetching draft laporan:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialData.length > 0) {
      fetchDraftLaporan();
    }
  }, [initialData]);

  const handleRowClick = async (event, record) => {
    let paramsData = "";
    try {
      const response = await axios.post("/api/partinduk", {
        key: record.key,
      });

      paramsData = response?.data?.rows[0]?.no_part;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }

    const isCheckbox =
      event.target.tagName === "INPUT" && event.target.type === "checkbox";
    const isCheckboxCell = event.target.className.includes(
      "ant-table-cell-with-append"
    );

    if (!isCheckbox && !isCheckboxCell) {
      router.push(`/detail/${paramsData}`);
    }
  };

  const onSelectChange = async (newSelectedRowKeys, selectedRows) => {
    try {
      const newlySelectedRows = selectedRows.filter(
        (row) => !selectedRowKeys.includes(row.key)
      );

      const unselectedKeys = selectedRowKeys.filter(
        (key) => !newSelectedRowKeys.includes(key)
      );

      for (const row of newlySelectedRows) {
        await axios.post("/api/draftlaporan/tambah", {
          id_pi: row.key,
          no_part: row.nomor_pi,
          no_part_update: row.nomor_pi_update,
        });
      }

      for (const key of unselectedKeys) {
        const rowToDelete = initialData.find((row) => row.key === key);
        if (rowToDelete) {
          const draftItem = cartItems.find(
            (item) => item.no_part === rowToDelete.nomor_pi
          );
          if (draftItem) {
            await axios.post("/api/draftlaporan/hapus", {
              id_draft: draftItem.id_draft,
            });
          }
        }
      }

      setSelectedRowKeys(newSelectedRowKeys);

      await fetchDraftLaporan();
      await fetchDataDraft();
    } catch (error) {
      console.error("Error updating draft laporan:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const columns = [
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nomorPi = (item.nomor_pi || "-").toString();
      const nomorPiUpdate = (item.nomor_pi_update || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPi.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPiUpdate.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(initialData);
    fetchPartInduk();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const removeFromCart = async (itemKey) => {
    try {
      const response = await axios.post("/api/draftlaporan/hapus", {
        id_draft: itemKey,
      });

      if (response.status === 200) {
        const removedItem = cartItems.find((item) => item.id_draft === itemKey);
        const matchingRow = initialData.find(
          (row) => row.nomor_pi === removedItem.no_part
        );

        if (matchingRow) {
          setSelectedRowKeys((prev) =>
            prev.filter((key) => key !== matchingRow.key)
          );
        }

        await fetchDraftLaporan();

        const totalPages = Math.ceil((cartItems.length - 1) / cartPageSize);
        if (currentCartPage > totalPages && totalPages > 0) {
          setCurrentCartPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.post("/api/draftlaporan/hapus", {
        id_draft: "clear",
      });

      if (response.status === 200) {
        setCartItems([]);
        setSelectedRowKeys([]);
        setCurrentCartPage(1);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getPaginatedCartItems = () => {
    const startIndex = (currentCartPage - 1) * cartPageSize;
    return cartItems.slice(startIndex, startIndex + cartPageSize);
  };

  const onCartPageChange = (page) => {
    setCurrentCartPage(page);
  };

  const toggleDraftVisibility = () => {
    setIsDraftVisible(!isDraftVisible);
  };

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <Flex justify="space-between" align="center">
          <div className="text-2xl font-medium">
            <p>Daftar Part Induk</p>
          </div>
          <Badge count={cartItems.length}>
            <FileDoneOutlined
              style={{ fontSize: "24px" }}
              onClick={toggleDraftVisibility}
            />
          </Badge>
        </Flex>

        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
        </div>

        <Flex gap="large">
          {/* Table Section */}
          <div style={{ flex: 2 }}>
            <Flex gap="middle" vertical>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  position: ["bottomRight"],
                  responsive: true,
                }}
                size="large"
                bordered={true}
                onRow={(record) => ({
                  onClick: (e) => handleRowClick(e, record),
                  style: { cursor: "pointer" },
                })}
                loading={loading}
              />
            </Flex>
          </div>

          {/* Cart Section with Pagination */}
          {isDraftVisible && (
            <div className="grid">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "360px",
                  maxHeight: "607px",
                  minHeight: "607px",
                  gap: "16px",
                }}
                className="rounded-md shadow-sm"
              >
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text>Draft Laporan ({cartItems.length})</Text>

                      {cartItems.length > 0 && (
                        <div>
                          <Button type="text" danger onClick={clearCart}>
                            Clear All
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                  style={{
                    flex: 1,
                    maxHeight: "607px",
                    minHeight: "607px",
                  }}
                >
                  <List
                    dataSource={getPaginatedCartItems()}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(item.id_draft)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            item.no_part ? (
                              <div className="grid">
                                <div>No Part</div>
                                <div className="font-bold">{item.no_part}</div>
                              </div>
                            ) : (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">-</div>
                              </div>
                            )
                          }
                          description={
                            item.no_part_update ? (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">
                                  {item.no_part_update}
                                </div>
                              </div>
                            ) : (
                              <div className="grid">
                                <div>No Part Update</div>
                                <div className="font-bold">-</div>
                              </div>
                            )
                          }
                        />
                      </List.Item>
                    )}
                    locale={{
                      emptyText: "Pilih part yang akan dijadikan laporan",
                    }}
                    loading={loading}
                  />

                  {cartItems.length > 0 && (
                    <Button
                      className="w-full mt-2 bg-blue-500 text-white"
                      onClick={() => setVisible(true)}
                    >
                      Generate excel
                    </Button>
                  )}
                  <Modal
                    title={
                      <div className="text-center text-xl font-semibold text-gray-700">
                        Generate Report
                      </div>
                    }
                    open={visible}
                    closeIcon={true}
                    onCancel={handleCancel}
                    footer={null}
                    centered
                  >
                    <div className="space-y-4 p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Part No.
                        </label>
                        <Input
                          placeholder="Enter part number"
                          value={partNo}
                          onChange={(e) => setPartNo(e.target.value)}
                          className="w-full rounded-md h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Part Name
                        </label>
                        <Input
                          placeholder="Enter part name"
                          value={partName}
                          onChange={(e) => setPartName(e.target.value)}
                          className="w-full rounded-md h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name
                        </label>
                        <Input
                          placeholder="Enter customer name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-md h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project
                        </label>
                        <Input
                          placeholder="Enter project name"
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          className="w-full rounded-md h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Revisi / Date
                        </label>
                        <Input
                          placeholder="Enter date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-md h-10"
                        />
                      </div>
                      <Button
                        className="w-full h-12 mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        onClick={handleLaporan}
                      >
                        Download to Excel
                      </Button>
                    </div>
                  </Modal>
                </Card>

                {/* Pagination Selalu di Bawah */}
                {cartItems.length > cartPageSize && (
                  <div
                    style={{
                      textAlign: "right",
                      justifyItems: "end",
                    }}
                  >
                    <Pagination
                      current={currentCartPage}
                      total={cartItems.length}
                      pageSize={cartPageSize}
                      onChange={onCartPageChange}
                      size="large"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default Dashboard;
