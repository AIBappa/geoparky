"""
    Clustering visualisations to show dangerous points at varying levels of abstraction
"""

import streamlit as st
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

# Read the input dataframe
df = pd.read_csv("../traffic-danger-points-analysis/bangalore_danger_spots.csv")


# KMeans Clustering algorithm
def get_centers_kmeans(num_clusters):
    global df
    
    if num_clusters < 0:
        num_clusters = -num_clusters

    kmeans = KMeans(n_clusters=int(num_clusters), random_state=0, n_init="auto").fit(df)
    cluster_centers = kmeans.cluster_centers_
    
    filtered_df = pd.DataFrame({
        "latitude" : cluster_centers[:, 0],
        "longitude" : cluster_centers[:, 1]
    })
    return filtered_df




# Main header
st.markdown("# Bangalore - Danger Spots Clustering")

# Number of clusters to be visualised
slider_value = st.slider(
    'Number of cluster centers to be visualised',
    min_value = 250,
    max_value = 10_000,
    step = 250,
    value = 250
)

# Visualise the map
locations_filtered = get_centers_kmeans(slider_value)
st.map(locations_filtered)

# Footer
st.markdown("#### Note: This data has been prepared using the publicly-available [Grey spot data](https://www.kaggle.com/datasets/apoorvwatsky/bangalore-accident-data) on traffic accidents in Bangalore.")
