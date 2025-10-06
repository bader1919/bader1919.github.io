# Sample Data Analytics Project

## Overview

This project demonstrates a comprehensive approach to customer behavior analysis, combining SQL data extraction, Power BI visualization, and Python-based statistical analysis to uncover actionable insights that drove a 25% improvement in customer retention.

## Business Challenge

The client, a mid-sized e-commerce company, was experiencing declining customer retention rates and needed to understand the underlying patterns in customer behavior to implement targeted retention strategies.

### Key Questions

- Which customer segments showed the highest churn risk?
- What behavioral patterns correlated with long-term loyalty?
- How could interventions be timed for maximum impact?

## Approach

### 1. Data Collection & Preparation

Using SQL Server, I extracted and cleaned transactional data from multiple sources:

```sql
SELECT 
    c.customer_id,
    c.signup_date,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(o.order_value) as lifetime_value,
    DATEDIFF(day, MAX(o.order_date), GETDATE()) as days_since_last_order
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.signup_date
HAVING COUNT(DISTINCT o.order_id) > 0
```

### 2. Exploratory Analysis

Python was used for statistical analysis and segmentation:

- RFM (Recency, Frequency, Monetary) analysis to segment customers
- Cohort analysis to track retention over time
- Correlation analysis to identify key behavioral indicators

### 3. Visualization & Insights

Power BI dashboards were developed to present findings to stakeholders, featuring:

- Customer segment performance metrics
- Churn prediction indicators
- Intervention opportunity timelines
- ROI projections for retention initiatives

## Key Findings

1. **High-Value At-Risk Segment**: 15% of customers with 90+ day inactivity represented 30% of potential revenue recovery
2. **Optimal Contact Timing**: Engagement campaigns at 60 days post-purchase showed 3x better response than 90+ day interventions
3. **Product Affinity Patterns**: Cross-category purchasers demonstrated 40% higher lifetime value

## Impact

The insights from this analysis led to:

- Implementation of automated engagement workflows
- Targeted product recommendations based on affinity patterns
- Tiered loyalty program aligned with customer segments
- **25% improvement in customer retention rate** over 6 months
- **$450K in recovered revenue** from at-risk segment

## Technologies Used

- **SQL Server**: Data extraction and transformation
- **Python (pandas, scikit-learn)**: Statistical analysis and segmentation
- **Power BI**: Interactive dashboard development
- **Excel**: Ad-hoc analysis and stakeholder reporting

## Lessons Learned

- Early intervention is significantly more effective than recovery efforts
- Combining multiple data sources provides richer customer understanding
- Visual storytelling accelerates stakeholder buy-in and action

---

*This project showcases the end-to-end analytics process from data collection through actionable recommendations and measurable business impact.*
