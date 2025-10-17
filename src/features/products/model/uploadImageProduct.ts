import fs from "fs";
import path from "path";

export async function uploadImageProduct(file: File): Promise<string> {
  // Đọc dữ liệu file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Đường dẫn thư mục lưu ảnh (trong public)
  const uploadDir = path.join(process.cwd(), "public/uploads/products");

  // Tạo folder nếu chưa có
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Tạo tên file ngẫu nhiên để tránh trùng
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  // Ghi file vào thư mục
  await fs.promises.writeFile(filePath, buffer);

  // Trả về đường dẫn public (để frontend hiển thị)
  return `/uploads/products/${fileName}`;
}
