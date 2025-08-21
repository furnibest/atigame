import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faRecycle, faHandshake } from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Crafting Quality Outdoor Furniture Since 2010</p>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <div className="about-text-with-image">
            <div className="about-text">
              <p>ATIGA Furniture was founded with a passion for creating beautiful, durable outdoor furniture that brings people closer to nature. Based in Indonesia, we combine traditional craftsmanship with modern design to create pieces that stand the test of time.</p>
              <p>Originating in Jepara—a city renowned as the center of the finest carving and furniture in the archipelago—each ATIGA product is crafted by the skilled hands of local craftsmen who have passed down traditions from generation to generation. We combine traditional values with modern design touches to create timeless pieces.</p>
            </div>
            <div className="about-image">
              <Image src="/images/mejapayung.jpg" alt="Meja Payung ATIGA" width={800} height={533} />
            </div>
          </div>
        </div>
        
        <div className="about-values">
          <h2>Our Values</h2>
          <div className="values-container">
            <div className="value-card">
              <FontAwesomeIcon icon={faLeaf} className="value-icon" />
              <h3>Sustainability</h3>
              <p>We use responsibly sourced materials and ensure our production processes minimize environmental impact.</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faHandshake} className="value-icon" />
              <h3>Craftsmanship</h3>
              <p>Each piece is crafted with care by skilled artisans who take pride in their work.</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faRecycle} className="value-icon" />
              <h3>Durability</h3>
              <p>We design our furniture to last, reducing waste and providing better value for our customers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}