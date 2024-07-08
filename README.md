# Repo for TikTok Hackathon 
 
## Description 
 
<p align="center"> 
</p> 
 
### Problem statement: Unleashing Potential in Machine Learning Infrastructure (Singapore) 
 
<br/> 
Machine Learning Basics for Beginners (MLBB) is a web application designed to simplify the complexities of machine learning for users with no programming experience. MLBB provides an intuitive and comprehensive interface that allows users to easily perform data preprocessing and model training tasks. With MLBB, users can clean their data and train machine learning models by simply selecting options made available to them on our application, making the process straightforward and accessible. Our mission is to make the power of machine learning available to everyone, regardless of technical background. 
<br/><br/> 
App Features: 
<ol> 
  <li> 
    CSV Upload 
  <lil> 
  <li> 
    Data Preprocessing (Encode Categorical Variables, Scale Features, Select Features, Impute Missing Values, Handle Outliers, Oversample, Undersample, SMOTE, Dropping Columns) 
  <lil> 
  <li> 
    Classification Modelling 
  </li> 
  <li> 
    Regression Modelling 
  </li> 
   <li>
    KMeans Clustering
   </li>
   <li>
    Data, Analytics and Results Visualisation
   </li>
</ol> 
<br/> 
Libraries used: 
<ol> 
  <li> 
    pandas 
  <lil> 
  <li> 
    numpy 
  <lil> 
  <li> 
    imblearn 
  <lil> 
  <li> 
    sklearn 
  <lil> 
  <li> 
    matplotlib 
  <lil> 
</ol> 
 
### Running the script 
 
1. Client
 ```
cd client
npm install
npm run dev
 ```

Make sure to include a `.env` file to specify the server URL
```
VITE_SERVER_URL=http://localhost:5001
```
 
2. Server
 
 ```
cd server
pip install -r requirements.txt
python server.py
 ```
 
## Tech Stack 
 
![Flask](https://img.shields.io/badge/flask-%2320232a.svg?style=for-the-badge&logo=flask&logoColor=%2361DAFB) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white) 
![Python](https://img.shields.io/badge/Python-007ACC?style=for-the-badge&logo=python&logoColor=yellow)

## Deployment
Frontend: https://tiktokers-gamma.vercel.app/

Backend: https://tiktokers.onrender.com/
