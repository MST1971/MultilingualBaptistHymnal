import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterChurch.css';

function RegisterChurch({ theme }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pastor: '',
    name: '',
    association: '',
    conference: '',
    state: '',
    address: ''
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 200 * 1024); // 200kb limit
    
    if (validFiles.length !== files.length) {
      alert('Some photos were skipped because they exceed 200kb.');
    }

    if (photos.length + validFiles.length > 5) {
      alert('Maximum 5 photos allowed.');
      return;
    }

    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Church Name and Address are required.');
      return;
    }
    setLoading(true);
    
    // Create new church object
    const newChurch = {
      ...formData,
      id: `reg-${Date.now()}`,
      registeredDate: new Date().toISOString(),
      // In a real app, photos would be uploaded to a server
      // For now, we'll just store the fact that there are photos
      hasPhotos: photos.length > 0
    };

    // Save to localStorage
    const savedChurches = JSON.parse(localStorage.getItem('registeredChurches') || '[]');
    localStorage.setItem('registeredChurches', JSON.stringify([...savedChurches, newChurch]));

    setTimeout(() => {
      setLoading(false);
      alert('Church registration successful!');
      navigate('/find-church');
    }, 1000);
  };

  return (
    <div className={`register-church-container ${theme}`}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Register Your Church</h1>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Church Name*</label>
          <input
            type="text"
            name="name"
            placeholder="Full name of the church"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Church Pastor</label>
          <input
            type="text"
            name="pastor"
            placeholder="Name of the presiding pastor"
            value={formData.pastor}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Association</label>
            <input
              type="text"
              name="association"
              placeholder="e.g. Hope Association"
              value={formData.association}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Conference</label>
            <input
              type="text"
              name="conference"
              placeholder="e.g. Lagos West"
              value={formData.conference}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            <option value="Abia">Abia</option>
            <option value="Adamawa">Adamawa</option>
            <option value="Akwa Ibom">Akwa Ibom</option>
            <option value="Anambra">Anambra</option>
            <option value="Bauchi">Bauchi</option>
            <option value="Bayelsa">Bayelsa</option>
            <option value="Benue">Benue</option>
            <option value="Borno">Borno</option>
            <option value="Cross River">Cross River</option>
            <option value="Delta">Delta</option>
            <option value="Ebonyi">Ebonyi</option>
            <option value="Edo">Edo</option>
            <option value="Ekiti">Ekiti</option>
            <option value="Enugu">Enugu</option>
            <option value="FCT">FCT - Abuja</option>
            <option value="Gombe">Gombe</option>
            <option value="Imo">Imo</option>
            <option value="Jigawa">Jigawa</option>
            <option value="Kaduna">Kaduna</option>
            <option value="Kano">Kano</option>
            <option value="Katsina">Katsina</option>
            <option value="Kebbi">Kebbi</option>
            <option value="Kogi">Kogi</option>
            <option value="Kwara">Kwara</option>
            <option value="Lagos">Lagos</option>
            <option value="Nasarawa">Nasarawa</option>
            <option value="Niger">Niger</option>
            <option value="Ogun">Ogun</option>
            <option value="Ondo">Ondo</option>
            <option value="Osun">Osun</option>
            <option value="Oyo">Oyo</option>
            <option value="Plateau">Plateau</option>
            <option value="Rivers">Rivers</option>
            <option value="Sokoto">Sokoto</option>
            <option value="Taraba">Taraba</option>
            <option value="Yobe">Yobe</option>
            <option value="Zamfara">Zamfara</option>
          </select>
        </div>

        <div className="form-group">
          <label>Address* (Google Maps Integration)</label>
          <textarea
            name="address"
            placeholder="Full physical address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="photo-upload-section">
          <label>Church Photos (Max 5, 200kb each)</label>
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview-card">
                <img src={photo.preview} alt="Church" />
                <button type="button" onClick={() => removePhoto(index)}>×</button>
              </div>
            ))}
            {photos.length < 5 && (
              <label className="upload-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <i className="fas fa-camera"></i>
                <span>Add Photo</span>
              </label>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Register Church'}
        </button>
      </form>
    </div>
  );
}

export default RegisterChurch;
