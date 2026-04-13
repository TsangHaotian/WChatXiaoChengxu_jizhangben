# WChatXiaoChengxu_jizhangben: Smart Expense Tracker Mini Program

A comprehensive personal finance management WeChat Mini Program designed to help users effortlessly record daily income and expenses, analyze spending habits, and manage budgets. With an intuitive interface and powerful features, it makes personal financial management simple and efficient.

## 📱 Screenshots

<img width="450" height="950" alt="屏幕截图 2025-12-22 222536" src="https://github.com/user-attachments/assets/22658419-904c-48d8-837e-5aa8bde694d0" />
<img width="450" height="950" alt="屏幕截图 2025-12-22 222543" src="https://github.com/user-attachments/assets/48711454-e7a5-47f4-a2bc-1de85e0008aa" />
<img width="450" height="950" alt="屏幕截图 2025-12-22 222550" src="https://github.com/user-attachments/assets/dc2d5781-a0b8-49e7-8299-3f12d23c5cee" />
<img width="450" height="950" alt="屏幕截图 2025-12-22 222606" src="https://github.com/user-attachments/assets/6d78f3e4-d793-4ccf-b9cd-1bb28b348197" />


## ✨ Core Features

### 💰 Income & Expense Management
- Record daily income and expenses with ease.
- Support for multiple spending categories (Dining, Transportation, Entertainment, etc.).
- Customizable category icons and names.
- Quick deletion by long-pressing a transaction.

### 📅 Time Management
- View bills organized by month.
- Detailed daily expense breakdowns.
- Fast switching between different months.

### 📊 Data Analytics
- Total income and expense statistics.
- Spending distribution analysis by category.
- Monthly spending trend charts.
- Budget management tools.

### 🔄 Data Synchronization
- Local data storage for privacy.
- Support for data backup and restoration.
- Multi-device synchronization (requires user login).

## 🛠 Technical Implementation

### Tech Stack
- **Frontend Framework:** Native WeChat Mini Program Development.
- **State Management:** Global Mini Program Data Management.
- **UI Components:** Custom components + Native WeChat components.
- **Storage:** WeChat Local Storage + Cloud Development.

### Project Structure
```text
miniprogram/
├── app.js              # Main application logic
├── app.json            # Global configuration
├── app.wxss            # Global styles
├── pages/              # Page directories
│   ├── index/          # Home page - Bill list
│   ├── addBook/        # Add/Edit bill
│   ├── chart/          # Charts & Statistics
│   └── my/             # User Profile
├── components/         # Reusable components
├── assets/             # Static resources
│   ├── icons/          # Icon assets
│   └── images/         # Image assets
└── utils/              # Utility functions
    ├── api.js          # API request handlers
    ├── util.js         # Helper methods
    └── config.js       # Configuration settings
```

## 🚀 Quick Start

### Prerequisites
- WeChat Developer Tools
- WeChat Mini Program Account (AppID)
- Node.js (Optional, for build tools)

### Development Steps
1. **Clone the repository**
   ```bash
   git clone [Your Repository URL]
   ```

2. **Import into WeChat Developer Tools**
   - Open WeChat Developer Tools.
   - Select **"Import Project"**.
   - Choose the project directory.
   - Enter your AppID (or use a Test Account).

3. **Run the Project**
   - Click the **"Compile"** button.
   - Scan the QR code with WeChat on your mobile device to preview.

## 📖 Usage Guide

### Adding a Transaction
1. Tap the **"+"** button at the bottom navigation bar.
2. Select the type: **Income** or **Expense**.
3. Enter the amount and remarks.
4. Choose the category and date.
5. Tap **Save** to record.

### Viewing Statistics
1. Navigate to the **"Charts"** page.
2. View monthly income and expense summaries.
3. Analyze spending distribution by category.
4. Review spending trend analysis.

### Data Management
- **Delete Records:** Long-press any bill to delete it.
- **Filter:** Filter bills by month.
- **Auto-Save:** Data is automatically saved locally.
