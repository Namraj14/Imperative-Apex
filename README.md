# Imperative-Apex (Manually write apex class)

## 🔥 What is Imperative Apex?

**Imperative Apex** is when you manually call Apex methods from your Lightning Web Component (LWC) using JavaScript. Unlike the declarative `@wire` approach, imperative calls give you full control over when and how the server-side code executes. 
An imperative Apex call is made when you decide in your JavaScript to call the Apex method — like when a user clicks a button, or a condition is met.

🧠 Key idea:
“JavaScript controls when the Apex method is called.”
---

## 💡 When to Use Imperative Apex

| Use Case                               | Recommended         |
| -------------------------------------- | ------------------- |
| On button click                        | ✅ Yes               |
| Conditional data fetch                 | ✅ Yes               |
| Complex logic (chained calls, filters) | ✅ Yes               |
| Auto-load simple data                  | ❌ Use `@wire`       |
| Read-only record view                  | ❌ Use LDS (`@wire`) |

---

## 🛠️ Project Structure

```
force-app
└── main
    └── default
        ├── classes
        │   └── AccountController.cls
        └── lwc
            └── imperativeAccount
                ├── imperativeAccount.js
                ├── imperativeAccount.html
                └── imperativeAccount.js-meta.xml
```

---

## 🔧 Step-by-Step Example

### 📁 1. Apex Class: `AccountController.cls`

```apex
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static Account getAccountById(String accountId) {
        return [SELECT Name, Industry FROM Account WHERE Id = :accountId LIMIT 1];
    }
}
```

### 🔍 Explanation:

* `@AuraEnabled(cacheable=true)` allows the method to be used in LWC and supports caching.
* Must be `public static`.
* Takes `accountId` as input and returns one Account record.

---

### 📁 2. JavaScript: `imperativeAccount.js`

```js
import { LightningElement } from 'lwc';
import getAccountById from '@salesforce/apex/AccountController.getAccountById';

export default class ImperativeAccount extends LightningElement {
    accountName;
    accountIndustry;
    error;

    recordId = '001xx000003DGXzAAO'; // Example Account Id

    connectedCallback() {
        getAccountById({ accountId: this.recordId })
            .then(result => {
                this.accountName = result.Name;
                this.accountIndustry = result.Industry;
            })
            .catch(error => {
                this.error = error;
                console.error('Error fetching account:', error);
            });
    }
}
```

---

### 📁 3. HTML: `imperativeAccount.html`

```html
<template>
    <lightning-card title="Account Info (Imperative Apex)">
        <template if:true={accountName}>
            <p><strong>Name:</strong> {accountName}</p>
            <p><strong>Industry:</strong> {accountIndustry}</p>
        </template>
        <template if:true={error}>
            <p style="color:red;">Error: {error.body.message}</p>
        </template>
    </lightning-card>
</template>
```

---

### 📁 4. Meta File: `imperativeAccount.js-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

---

## ✅ Best Practices

| Tip                                         | Description                        |
| ------------------------------------------- | ---------------------------------- |
| ✅ Use for user actions                      | Great for buttons and events       |
| ✅ Handle errors                             | Always include `.catch()` block    |
| ✅ Use async/await for clarity               | Modern and cleaner syntax          |
| ❌ Don’t use cacheable=true on write methods | Only use on `read` methods         |
| ❌ Avoid calling Apex inside loops           | Instead collect data and call once |

---

## 📅 Optional: Using Async/Await

```js
async connectedCallback() {
    try {
        const result = await getAccountById({ accountId: this.recordId });
        this.accountName = result.Name;
        this.accountIndustry = result.Industry;
    } catch (error) {
        this.error = error;
    }
}
```

---

## 🚀 Conclusion

* Imperative Apex gives **control and flexibility**.
* Use when you need **custom logic, user-triggered actions**, or **conditional operations**.
* Make sure to **handle errors** and use best practices to keep your code clean and reliable.

Happy Coding! ✨
