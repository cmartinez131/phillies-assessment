"""
- business logic functions
- fetch and process data 
"""

import pandas as pd
import httpx
from config import DATA_URL
from io import StringIO


def fetch_salary_data(url: str) -> pd.DataFrame:
    """
    Fetch raw HTML content from the URL
    """
    response = httpx.get(url)
    response.raise_for_status()


    html_data = StringIO(response.text)
    tables = pd.read_html(html_data)

    if not tables:
        raise ValueError("No tables found in the HTML content")

    df = tables[0]

    return df


def clean_salary_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the salary data in the dataframe
    """
    # Create a copy to avoid modifying original
    df_clean = df.copy()
    # Replace "no salary data" and empty strings with NaN
    df_clean['Salary'] = df_clean['Salary'].astype(str)

    # Remove dollar signs and commas
    #pandas string methods: https://pandas.pydata.org/docs/user_guide/text.html
    df_clean['Salary'] = df_clean['Salary'].str.replace(' ','')
    df_clean['Salary'] = df_clean['Salary'].str.replace('$', '', regex=False)
    df_clean['Salary'] = df_clean['Salary'].str.replace(',', '')
    
    # Convert to numeric, coercing errors to NaN
    df_clean['Salary'] = pd.to_numeric(df_clean['Salary'], errors='coerce')
    # drop rows where salarys is NaN
    df_clean = df_clean.dropna(subset=['Salary'])

    return df_clean



def get_all_salary_data() -> list[dict]:
    """
    Fetch and return all salary data
    """
    raw_table_df = fetch_salary_data(DATA_URL)
    cleaned_df = clean_salary_data(raw_table_df)

    #cleaned_df = cleaned_df.head(125)
    # Convert to list of dictionaries to return for JSON response
    return cleaned_df.to_dict(orient="records")


# helper function to calcualte qualifying offer, given a cleaned dataframe
def calculate_qualifying_offer(df: pd.DataFrame) -> float:
    """
    Calculate the qualifying offer based on the salary data
    Use the average of the top 125 highest salaries
    """
    if df.empty:
        raise ValueError("Dataframe is empty. Error calculating qualifying offer.")
    

    #current_year = pd.Timestamp.now().year
    year = df['Year'].max()
    salaries_df = df.copy()

    # only consider salaries rows from the previous year
    salaries_df = salaries_df[salaries_df['Year'] == year]

    # sort salaries descending
    sorted_salaries_df = salaries_df.sort_values(by='Salary', ascending=False)

    # take the top 125 highest salaries    
    top_125_salaries = sorted_salaries_df.head(125)

    # calaculate the average of the top 125 salaries
    qualifying_offer = top_125_salaries['Salary'].mean()

    return qualifying_offer


# The main function that is called by the route
def get_qualifying_offer(url: str = DATA_URL) -> dict:
    """
    Fetches data and calculates qualifying offer
    
    """
    original_data_df = fetch_salary_data(url)

    # clean rows in df
    clean_df = clean_salary_data(original_data_df)

    # calculate the qualifying offer
    qualifying_offer = calculate_qualifying_offer(clean_df)


    # additional relevant statistics
    year = clean_df['Year'].max()
    current_year_df = clean_df[clean_df['Year'] == year]
    top_125_df = current_year_df.sort_values(by='Salary', ascending=False).head(125)
    top_10_players = current_year_df.sort_values(by='Salary', ascending=False).head(10).to_dict(orient="records")
    

    return {
        "value": qualifying_offer,
        "top_125_stats": {
            "year": int(year),
            "count": len(top_125_df),
            "minimum": float(top_125_df['Salary'].min()),
            "maximum": float(top_125_df['Salary'].max()),
            "average": float(qualifying_offer),
            "median": float(top_125_df['Salary'].median())
        },
        "top_10_players": top_10_players
    }



if __name__ == "__main__":

    print("Qualifying Offer:")
    print(get_qualifying_offer())