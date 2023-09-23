"""
    Clustering visualisations to show dangerous points at varying levels of abstraction
"""

import streamlit as st
import pandas as pd
import sys
import subprocess
import time

# Attempt importing `sklearn` ref: https://discuss.streamlit.io/t/using-package-from-a-private-repo-in-streamlit-deploy/21353/5
try:
    import sklearn

except ModuleNotFoundError as e:
    subprocess.Popen([f'{sys.executable} -m pip install scikit-learn'], shell=True)
    time.sleep(20)

from sklearn.cluster import KMeans

# Read the input dataframe
# Attempt GDrive link for streamlit deploy ref: https://stackoverflow.com/questions/36096194/where-can-i-host-a-csv-so-i-can-directly-read-it-into-a-neo4j-database
df = pd.read_csv("https://drive.google.com/uc?export=download&id=1eL-MxgpcCGYRbAqZxoIMpi8-FDSZ-83Z")

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
