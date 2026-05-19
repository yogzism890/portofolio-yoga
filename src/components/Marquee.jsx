import React from 'react';

const Marquee = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="marquee-item">
              PRAYOGA AFFANDI <span className="marquee-star">✦</span>
            </div>
            <div className="marquee-item">
              プラヨガアッファンヂ <span className="marquee-star">✦</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
