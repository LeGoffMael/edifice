# Edifice

This solution intends to simplifies the dataset generation process by automating smart cropping and offering an automatic prompt using interrogators for data collection.

> **_NOTE:_** This project is under development and probably doesn't deserve your interest yet.

## Installation

### Install react side
```
npm install
```

### Install Flask side
```
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

<details>
<summary>Others installation</summary>

### To install [deepdanbooru](https://github.com/KichangKim/DeepDanbooru) interrogator
```
cd api
source venv/bin/activate
git clone https://github.com/KichangKim/DeepDanbooru.git
cd DeepDanbooru
pip install -r requirements.txt
pip install .[tensorflow] # on macOS pip install '.[tensorflow]'
```
</details>

## Start instructions

### To start React fapp

```
npm start
```

### To start Flask backend

```
npm run start-api
```