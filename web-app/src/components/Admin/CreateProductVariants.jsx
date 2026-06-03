import { useEffect, useState } from 'react';
import './CreateProductVariants.css';



const CreateProductVariants = ({productId, versions, colors}) => {


  // Khởi tạo state để quản lý dữ liệu nhập vào
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    // Tạo các phiên bản kết hợp từ colors và versions
    const generatedVariants = [];
    colors.forEach((color) => {
      versions.forEach((version) => {
        generatedVariants.push({
          id: color.id + '-' + version.id, // Tạo ID duy nhất cho mỗi phiên bản
          colorId: color.id,
          versionId: version.id,
          productId: productId, 
          price: '',
          stock: '',
        });
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariants(generatedVariants);
  }, [colors, versions]);

  // Hàm xử lý cập nhật state khi người dùng gõ vào các ô input
  const handleInputChange = (id, field, value) => {
    const updatedVariants = variants.map((variant) =>
      variant.id === id ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  // Hàm xử lý khi bấm nút "Save"
  const handleSaveVariants = () => {
    // Validate cơ bản
    const isValid = variants.every(v => v.price !== '' && v.stock !== '');
    if (!isValid) {
      alert("Vui lòng nhập đầy đủ Giá và Số lượng cho tất cả phiên bản!");
      return;
    }

    // Gửi payload lên API
    console.log('Data ready to submit to API:', variants);
    alert('Lưu thành công! Mở console để xem dữ liệu.');
  };

  return (
    <div className="variants-container">
      <div className="variants-header">
        <h2>Set up Product Variants</h2>
        <p>Configure price, stock, and SKU for each auto-generated combination.</p>
      </div>

      <div className="variants-table-wrapper">
        <table className="variants-table">
          <thead>
            <tr>
              <th>Variant (Color - Version)</th>
              <th>Price (VND)</th>
              <th>Stock</th>
              <th>SKU</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => {
              versions.map((version) => {
                <tr key={color.id + '-' + version.id}>
                <td className="variant-name-cell">
                  <span className="variant-color" style={{"background-color" : color.hex}}>{color.name}</span>
                  <span className="variant-badge">{version.name}</span>
                </td>
                
                <td>
                  <input
                    type="number"
                    className="variant-input"
                    placeholder="e.g. 20000000"
                    onChange={(e) => handleInputChange(color.id + '-' + version.id, 'price', e.target.value)}
                  />
                </td>
                
                <td>
                  <input
                    type="number"
                    className="variant-input"
                    placeholder="0"
                    onChange={(e) => handleInputChange(color.id + '-' + version.id, 'stock', e.target.value)}
                  />
                </td>
              </tr>
            })})}
          </tbody>
        </table>
      </div>

      <div className="variants-footer">
        <button className="btn-secondary">Back to Product</button>
        <button className="btn-primary" onClick={handleSaveVariants}>
          Save Variants
        </button>
      </div>
    </div>
  );
};

export default CreateProductVariants;