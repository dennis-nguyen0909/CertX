/**
 * Định dạng public key để hiển thị ngắn gọn hơn, ví dụ: "abcd1234...wxyz5678"
 * Nếu publicKey không hợp lệ hoặc quá ngắn, trả về nguyên chuỗi.
 * @param publicKey Chuỗi public key
 * @param visible Số ký tự hiển thị đầu/cuối (default: 8)
 * @returns Chuỗi đã được rút gọn
 */
export function formatPublicKey(
  publicKey?: string,
  visible: number = 12
): string {
  if (!publicKey || publicKey.length <= visible * 2 + 3) {
    return publicKey || "";
  }
  return `${publicKey.slice(0, visible)}...${publicKey.slice(-visible)}`;
}
