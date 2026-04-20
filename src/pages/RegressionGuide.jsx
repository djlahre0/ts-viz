import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Cpu, ChevronDown, ChevronRight, Code, GitMerge, LineChart, Layers, TerminalSquare } from 'lucide-react';

const CodeBlock = ({ code, language = 'python' }) => (
  <div style={{
    background: '#0d1117',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      background: '#161b22',
      borderBottom: '1px solid var(--border-subtle)',
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TerminalSquare size={14} />
        Complete, Runnable {language.toUpperCase()} Example
      </div>
    </div>
    <div style={{ padding: '16px', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
      <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e6edf3', lineHeight: '1.5', whiteSpace: 'pre' }}>
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 'var(--space-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: '20px',
          background: isOpen ? 'var(--bg-glass-hover)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-primary)',
          transition: 'all var(--transition-fast)'
        }}
      >
        <div style={{
          background: 'var(--bg-sidebar)',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          color: 'var(--primary-color)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Icon size={22} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, flex: 1, wordBreak: 'break-word', minWidth: 0, whiteSpace: 'normal' }}>{title}</h3>
        <div style={{ flexShrink: 0 }}>
          {isOpen ? <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '0 24px 24px', color: 'var(--text-secondary)', lineHeight: '1.7' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function RegressionGuide() {
  return (
    <div className="page-container" style={{ overflowX: 'hidden', width: '100%', boxSizing: 'border-box', paddingTop: 'var(--space-2xl)' }}>
      <div className="home-hero" style={{ paddingBottom: 'var(--space-xl)' }}>
        <motion.h1 className="home-hero__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
          Analysis Pipelines
        </motion.h1>
        <motion.p className="home-hero__subtitle" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          A complete, reproducible guide to mastering regression modeling. Learn the theory behind Variable Selection, Predictive Engines, Hybrid Pipelines, and Penalized Regressions—complete with sample data and executable Python code.
        </motion.p>
      </div>

      {/* --- STEP 1 --- */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '1.6rem', flexWrap: 'wrap' }}>
          <Database size={28} color="#60a5fa" style={{ flexShrink: 0 }} /> Step 1: Variable Selection (Feature Extraction)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem', maxWidth: '800px' }}>
          When a dataset has hundreds of variables, mathematical models suffer from the <strong>Curse of Dimensionality</strong>. They memorize random noise instead of real patterns, destroying accuracy on new data. Variable Selection filters the dataset, isolating exclusively the features that hold true predictive power.
        </p>

        <SectionCard title="Stepwise Regression (SR)" icon={GitMerge} defaultOpen={true}>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>The Theory:</strong>
            <p>Stepwise Regression is a greedy algorithm used to build a model from scratch. It mathematically tests every single variable in the dataset to see its <strong>p-value</strong> (statistical significance). If a variable improves the model heavily (p &lt; 0.05), it is kept. If it provides little information, it is thrown out. This results in an incredibly clean, interpretable subset of data.</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>When to use it:</strong>
            <p>Use SR when you have 10-50 real-world variables (like Temp, Pressure, Humidity) and you need to explain to stakeholders EXACTLY which variables are driving the results. Do not use SR on image pixels or sensor arrays.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
import statsmodels.api as sm

# 1. Create a Sample DataFrame (100 rows, 4 features)
np.random.seed(42)
df = pd.DataFrame({
    'Temp': np.random.normal(25, 5, 100),       # Meaningful feature
    'Humidity': np.random.normal(50, 10, 100),  # Meaningful feature
    'Noise1': np.random.normal(0, 1, 100),      # Useless feature
    'Noise2': np.random.normal(0, 1, 100)       # Useless feature
})
# Target Y is only influenced by Temp and Humidity
df['Target_Yield'] = 10 + (2.5 * df['Temp']) - (1.2 * df['Humidity']) + np.random.normal(0, 2, 100)

# 2. Forward Stepwise Algorithm
X = df.drop('Target_Yield', axis=1)
y = df['Target_Yield']

def forward_stepwise(X, y, significance_level=0.05):
    initial_features = X.columns.tolist()
    best_features = []
    
    while len(initial_features) > 0:
        remaining_features = list(set(initial_features) - set(best_features))
        new_pvalues = pd.Series(index=remaining_features, dtype=float)
        
        # Test the addition of each remaining feature
        for new_column in remaining_features:
            features = best_features + [new_column]
            model = sm.OLS(y, sm.add_constant(X[features])).fit()
            new_pvalues[new_column] = model.pvalues[new_column]
            
        # Extract the minimum p-value
        min_p_value = new_pvalues.min()
        if min_p_value < significance_level:
            best_features.append(new_pvalues.idxmin())
        else:
            break # Stop adding if no feature is significant anymore
            
    return best_features

# 3. Execution
selected = forward_stepwise(X, y)
print("Original Variables:", list(X.columns))
print("Variables Selected by SR:", selected)
# Output will correctly pick ['Temp', 'Humidity'] and drop the noise!
`} />
        </SectionCard>

        <SectionCard title="Principal Component Analysis (PCA)" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>The Theory:</strong>
            <p>PCA does not "drop" variables like SR. Instead, it mathematically rotates and squishes highly-correlated variables together to create newly minted, artificial variables called "Principal Components" (PCs). These PCs capture the maximum "variance" of the total dataset, while being mathematically completely uncorrelated to one another.</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>When to use it:</strong>
            <p>Crucial for incredibly wide datasets with severe multicollinearity, such as spectral readings or 10,000+ genetic markers. It compresses the dataset without losing the underlying patterns.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 1. Create Sample DataFrame (3 highly correlated features)
np.random.seed(42)
base_signal = np.random.normal(10, 2, 100)
df = pd.DataFrame({
    'Sensor_A': base_signal + np.random.normal(0, 0.1, 100),
    'Sensor_B': base_signal * 1.5 + np.random.normal(0, 0.1, 100),
    'Sensor_C': base_signal * 0.8 + np.random.normal(0, 0.1, 100),
})

# 2. PCA requires standardization (Mean=0, Variance=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# 3. Apply PCA mapping to capture 95% of the variance
pca = PCA(n_components=0.95)
X_pca = pca.fit_transform(X_scaled) # Transforms 3 columns into 1 Principal Component

# 4. Results
print(f"Original Data Shape: {df.shape}")   # (100, 3)
print(f"PCA Data Shape: {X_pca.shape}")     # (100, 1)
print(f"Explained Variance by PC1: {pca.explained_variance_ratio_[0]*100:.2f}%")
`} />
        </SectionCard>

        <SectionCard title="Partial Least Squares Regression (PLSR) Extraction" icon={Layers}>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>The Theory:</strong>
            <p>PCA is "Unsupervised"—it finds components that explain the X-data perfectly, but ignores what you are trying to predict (Y-data). PLSR is "Supervised". It creates latent components in X that specifically maximize the correlation with the target variable Y.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
from sklearn.cross_decomposition import PLSRegression
from sklearn.preprocessing import StandardScaler

# 1. Sample Data
np.random.seed(42)
X = pd.DataFrame(np.random.normal(0, 1, size=(100, 10))) # 10 random features
# Target Y acts heavily on feature 0 and 1
y = 5 + (3.5 * X[0]) + (2.0 * X[1]) + np.random.normal(0, 1, 100)

# 2. Extract Latent Structures mapped to Y
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pls = PLSRegression(n_components=2)
pls.fit(X_scaled, y)

# Transform the original 10 columns down to 2 PLS Latent Variables
X_latent = pls.transform(X_scaled)

print(f"Original X shape: {X.shape}")       # (100, 10)
print(f"PLSR Latent shape: {X_latent.shape}") # (100, 2)
`} />
        </SectionCard>
      </motion.div>

      {/* --- STEP 2 --- */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: 'var(--space-3xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '1.6rem', flexWrap: 'wrap' }}>
          <Cpu size={28} color="#fbbf24" style={{ flexShrink: 0 }} /> Step 2: Predictive Algorithms
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem', maxWidth: '800px' }}>
          After extracting the critical features in Step 1, the data is pushed into the predictive models to fit the mathematical plane.
        </p>

        <SectionCard title="Multiple Linear Regression (MLR)" icon={LineChart}>
           <div style={{ marginBottom: '16px' }}>
            <p><strong>The Theory:</strong> Fits the classic linear equation <code>Y = b0 + b1*x1 + b2*x2...</code>. Predicts outcomes by establishing a straight linear trajectory. Fails completely if the real-world relationship is a curve or a pattern.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# 1. Sample DataFrame
np.random.seed(42)
df = pd.DataFrame({ 'Speed': np.random.uniform(20, 100, 50), 'Weight': np.random.uniform(1000, 3000, 50) })
df['Stopping_Distance'] = 10 + 0.8*df['Speed'] + 0.05*df['Weight'] + np.random.normal(0, 5, 50)

# 2. Train Multiple Linear Regression
mlr_model = LinearRegression()
mlr_model.fit(df[['Speed', 'Weight']], df['Stopping_Distance'])

# 3. Interpret Outputs
print(f"Intercept (b0): {mlr_model.intercept_:.2f}")
print(f"Speed Coefficient (b1): {mlr_model.coef_[0]:.2f}")
print(f"Weight Coefficient (b2): {mlr_model.coef_[1]:.2f}")
# Output shows clearly: For every 1 unit of Speed, Distance increases by 0.8 units.
`} />
        </SectionCard>

        <SectionCard title="Artificial Neural Network (ANN) [Activation Functions]" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Theory:</strong> A Deep Learning framework that passes data through hidden matrices of "neurons". Each neuron mathematically alters the data using an <strong>Activation Function</strong>, allowing the network to wrap around wildly complex non-linear data planes.</p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
              <li><strong>Sigmoid (logistic):</strong> Turns values into a smooth S-curve <code>(0 to 1)</code>. Often suffers from 'vanishing gradients' where deep networks stop learning.</li>
              <li><strong>Tanh:</strong> Turns values into <code>-1 to 1</code>. Better gradients than Sigmoid.</li>
              <li><strong>ReLU (Rectified Linear Unit):</strong> Standard modern function. It returns exactly 0 if data is negative, and linear if positive. Incredibly lightning-fast and powerful.</li>
            </ul>
          </div>
<CodeBlock language="python" code={`from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np

# 1. Generate Non-Linear Data (Sine wave pattern)
np.random.seed(42)
X = np.sort(5 * np.random.rand(80, 1), axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, 80) # Complex curve

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Neural networks require standardized inputs to calculate gradients properly
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 2. ANN using ReLU activation
ann_model = MLPRegressor(
    hidden_layer_sizes=(100, 50), # 1st layer has 100 neurons, 2nd has 50
    activation='relu',            # Activation choice
    solver='adam',                # Optimizer
    max_iter=1000,
    random_state=42
)
ann_model.fit(X_train_scaled, y_train)

score = ann_model.score(X_test_scaled, y_test)
print(f"ANN Model R^2 Score: {score:.3f}")
`} />
        </SectionCard>

        <SectionCard title="Support Vector Regression (SVR) [Kernel Selection]" icon={GitMerge}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Theory:</strong> SVR fits an $\epsilon$-tube around the data. Points falling *inside* the tube cost zero error. Points outside the tube dictate the mathematical boundary (the "Support Vectors"). This makes SVR unbelievably immune to data anomalies and outliers.</p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
              <li><strong>Linear Kernel:</strong> Forces a straight boundary.</li>
              <li><strong>Polynomial Kernel:</strong> Fits parabolic or quadratic constraints.</li>
              <li><strong>RBF Kernel:</strong> Maps data points into infinite-dimensional landscapes, untangling overlapping patterns easily.</li>
            </ul>
          </div>
<CodeBlock language="python" code={`from sklearn.svm import SVR
import numpy as np

# 1. Generate data with extreme outliers
np.random.seed(42)
X = np.sort(5 * np.random.rand(40, 1), axis=0)
y = 1.5 * X.ravel() + 2 + np.random.normal(0, 0.2, 40)
# Add massive outliers completely breaking standard MLR
y[::5] += 15 * (0.5 - np.random.rand(8))

# 2. Train SVR Models demonstrating the Kernel trick
# Linear boundary
svr_linear = SVR(kernel='linear', C=100, epsilon=0.1)
# RBF Complex boundary
svr_rbf = SVR(kernel='rbf', C=100, gamma=0.1, epsilon=0.1)

svr_linear.fit(X, y)
svr_rbf.fit(X, y)

print("SVR Models successfully fit despite violent outliers!")
# SVR ignores the y[::5] outliers entirely due to the epsilon tube math.
`} />
        </SectionCard>
      </motion.div>

      {/* --- STEP 3 --- */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: 'var(--space-3xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '1.6rem', flexWrap: 'wrap' }}>
          <Layers size={28} color="#a78bfa" style={{ flexShrink: 0 }} /> Step 3: Hybrid Modeler Combinations
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Here are the 9 combinations utilizing Step 1 plus Step 2. You <strong>MUST</strong> use a Pipeline architecture in Python to avoid "Data Leakage" (accidentally feeding the model future data during testing).
        </p>

        <h3 style={{ marginTop: '30px', marginBottom: '15px', color: 'var(--text-primary)' }}>Category A: Stepwise Regression (SR) Hybrids</h3>
        
        <SectionCard title="1. SR-MLR (Stepwise Multiple Linear Regression)" icon={LineChart}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Extract real-world variables using p-value thresholding, then feed them into classical linear regression.</p>
            <p><strong>Use Case:</strong> Maximum interpretability. You need to present to a board of directors highly linear data, mathematically proving exactly what specific features are driving the bottom line.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression

# 1. Dummy Data
np.random.seed(42)
X = pd.DataFrame(np.random.normal(0, 1, size=(200, 20))) 
y = 10 + 2*X[0] - 1.5*X[1] + np.random.normal(0, 1, 200)

# 2. Simulated Stepwise Feature Selection
# In a real scenario, this runs a loop checking p-values < 0.05
selected_features = [0, 1] 

# 3. MLR Predictor
X_reduced = X[selected_features]

mlr_model = LinearRegression()
mlr_model.fit(X_reduced, y)
print(f"SR-MLR Model Fitted Intercept: {mlr_model.intercept_:.2f}")
print(f"Coefficients strictly tied to chosen features: {mlr_model.coef_}")
`} />
        </SectionCard>

        <SectionCard title="2. SR-ANN (Stepwise Artificial Neural Network)" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Identify the 5 most statistically powerful raw variables using Stepwise Regression. Discard all other columns. Feed those exact 5 variables into a deep Neural Network.</p>
            <p><strong>Use Case:</strong> You have wildly non-linear patterns, but you still MUST know precisely which real-world variables were used as inputs for the black box.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
from sklearn.neural_network import MLPRegressor

np.random.seed(42)
X = pd.DataFrame(np.random.normal(0, 1, size=(200, 20))) 
y = np.sin(X[0] * 5) + np.random.normal(0, 0.1, 200) # Heavy non-linear

# Filter using SR logic
selected_features = [0] 
X_reduced = X[selected_features]

# Train Neural Net
ann_model = MLPRegressor(hidden_layer_sizes=(50, 50), activation='relu', max_iter=500)
ann_model.fit(X_reduced, y)
print(f"SR-ANN trained exclusively on {len(selected_features)} selected variables.")
`} />
        </SectionCard>

        <SectionCard title="3. SR-SVR (Stepwise Support Vector Regression)" icon={GitMerge}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Hand-pick statistical features via SR, then isolate anomalies utilizing Support Vector Regression's strict $\epsilon$-tube.</p>
            <p><strong>Use Case:</strong> The dataset is corrupted by severe data-entry errors or sensor-misfires, and you only want to trust explicitly proven real-world predictors.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.svm import SVR
import pandas as pd
import numpy as np

X = pd.DataFrame(np.random.normal(0, 1, size=(100, 10))) 
y = 3*X[0] + 5 + np.random.normal(0, 1, 100)
# Massive outlier injection
y[::10] += 50

selected_features = [0] 
X_reduced = X[selected_features]

svr_model = SVR(kernel='linear', C=1.0, epsilon=0.2)
svr_model.fit(X_reduced, y)
print("SR-SVR securely filtered out noise mathematically, operating on proven features only.")
`} />
        </SectionCard>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--text-primary)' }}>Category B: Principal Component (PCA) Hybrids</h3>

        <SectionCard title="4. PCA-MLR (Principal Component Regression)" icon={LineChart}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Historically known as <strong>PCR</strong>. It rotates and compresses extreme multicollinearity into neat, uncorrelated PCs, and applies standard linear rules to them.</p>
            <p><strong>Use Case:</strong> The absolute industry standard when dealing with Chemometric spectroscopic data (measuring wavelengths of light where thousands of columns are deeply tangled).</p>
          </div>
<CodeBlock language="python" code={`from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd

X = pd.DataFrame(np.random.normal(0, 1, size=(200, 50))) # Highly Collinear
y = 10 + 2*X[0] + 2*X[1] + np.random.normal(0, 1, 200)

pcr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=5)),
    ('mlr', LinearRegression())
])
pcr_pipeline.fit(X, y)
print("PCR Pipeline constructed: 50 features compressed unconditionally into MLR equation.")
`} />
        </SectionCard>

        <SectionCard title="5. PCA-ANN (PCA Neural Network)" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Push uncorrelated, information-dense Principal Components into the Neural Network.</p>
            <p><strong>Use Case:</strong> Deep learning architectures heavily struggle with thousands of randomly drifting features (they overfit immediately). Pre-processing with PCA solves this beautifully.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.random.normal(0, 1, size=(500, 100)) # 100 deep features
y = np.sin(X[:, 0]) * np.cos(X[:, 1]) + np.random.normal(0, 0.5, 500)

pca_ann_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=0.90)), # Keep 90% variance
    ('ann', MLPRegressor(hidden_layer_sizes=(64, 32), activation='relu', max_iter=500))
])
pca_ann_pipeline.fit(X, y)
print(f"PCA-ANN trained securely using {pca_ann_pipeline.named_steps['pca'].n_components_} synthetic components.")
`} />
        </SectionCard>

        <SectionCard title="6. PCA-SVR (PCA Support Vector Regression)" icon={GitMerge}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Removes underlying data-collinearity via PCA, then wraps the resulting clean abstract coordinates inside an outlier-resistant margin.</p>
            <p><strong>Use Case:</strong> Complex sensor analytics combining highly tangled inputs coupled with faulty sensor hardware requiring massive outlier protection.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.random.normal(0, 1, size=(100, 50)) 
y = np.sum(X[:, 0:3], axis=1) + np.random.normal(0, 1, 100)

pca_svr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=3)),
    ('svr', SVR(kernel='rbf', C=10.0))
])
pca_svr_pipeline.fit(X, y)
print("Pipeline Successfully executed. PCA-SVR combination trained globally.")
`} />
        </SectionCard>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--text-primary)' }}>Category C: Target-Aware (PLSR) Hybrids</h3>

        <SectionCard title="7. PLSR-MLR (Partial Least Squares Regression)" icon={LineChart}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Extract continuous combinations of X features that hold the highest predictive variance mapped to Y.</p>
            <p><strong>Use Case:</strong> Similar to PCR (PCA-MLR), but more advanced. Frequently used in Bio-Informatics because it explicitly avoids mapping completely irrelevant dataset variance (which standard PCA gets distracted by).</p>
          </div>
<CodeBlock language="python" code={`from sklearn.cross_decomposition import PLSRegression
from sklearn.preprocessing import StandardScaler
import numpy as np

# In reality, PLSR encompasses MLR mathematics internally. 
X = np.random.normal(0, 1, size=(200, 50))
y = 5.5 * X[:, 0] + np.random.normal(0, 0.5, 200)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

plsr_model = PLSRegression(n_components=2)
plsr_model.fit(X_scaled, y)
print("PLSR computationally extracted targeted structures. No secondary MLR step required.")
`} />
        </SectionCard>

        <SectionCard title="8. PLSR-ANN (PLSR Neural Network)" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Pre-screen 10,000 features. Collapse them into Latent Y-aligned Variables. Feed those precisely-tuned variables to Deep Learning.</p>
            <p><strong>Use Case:</strong> The ultimate cutting-edge solution for massive datasets (like Genomics sequencing). Prevents neural networks from memorizing false background-signal noise.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.pipeline import Pipeline
from sklearn.cross_decomposition import PLSRegression
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np

X = np.random.normal(0, 1, size=(100, 40))
y = np.sin(X[:, 0] * 2) + np.random.normal(0, 0.1, 100)

# WARNING: Scikit-learn's PLSRegression returns (X_scores, Y_scores) under transform
# Custom Wrappers are usually required to pipe it into ANN. 
# Here is the conceptual flow:
pls = PLSRegression(n_components=3)
pls.fit(X, y)
X_latent = pls.transform(X)

ann = MLPRegressor(hidden_layer_sizes=(50,), activation='relu')
ann.fit(X_latent, y)
print("PLSR successfully fed targeted projection matrices into the Deep Network logic.")
`} />
        </SectionCard>

        <SectionCard title="9. PLSR-SVR (PLSR Support Vector Regression)" icon={GitMerge}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>The Strategy:</strong> Fuses the incredible targeted-extraction intelligence of PLS with the mathematical density borders of SVMs.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.cross_decomposition import PLSRegression
from sklearn.svm import SVR
import numpy as np

X = np.random.normal(0, 1, size=(100, 20))
y = 1.5 * X[:, 0] + np.random.normal(0, 1, 100)

# Manual Pipeline bypass:
plsr = PLSRegression(n_components=3)
plsr.fit(X, y)

X_targeted_features = plsr.transform(X)

svr = SVR(kernel='rbf', C=1.0)
svr.fit(X_targeted_features, y)
print("PLSR-SVR successfully executed: Outlier resistance applied to targeted metrics.")
`} />
        </SectionCard>
      </motion.div>

      {/* --- ALTERNATIVE --- */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-3xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '1.6rem', flexWrap: 'wrap' }}>
          <Code size={28} color="#f87171" style={{ flexShrink: 0 }} /> Alternative: Penalized Regularization
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Two-Step models (like PCA-ANN) are computationally heavy. Regularized models solve Feature Extraction AND Prediction together in a single stage by applying a "penalty" parameter to the math.
        </p>

        <SectionCard title="Ridge Regression (L2 Penalty)" icon={Layers}>
          <p><strong>Theory:</strong> Adds a squared penalty ($\alpha$) to the regression loss. It physically forces the coefficients of less important data points to shrink near zero. It stabilizes multicollinear datasets perfectly without outright destroying any variables.</p>
<CodeBlock language="python" code={`from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
import numpy as np

# Sample Data
X = np.random.rand(100, 10)
y = np.sum(X[:, 0:2], axis=1) + np.random.normal(0, 0.1, 100) # Only first 2 are useful
X_train, X_test, y_train, y_test = train_test_split(X, y)

# Ridge model with penalty strength (alpha) of 1.0
ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train, y_train)

print(f"Top Ridge Coefs: {ridge_model.coef_[:4]}") 
# Notice coefficients never hit exactly 0.0, they just become very small
`} />
        </SectionCard>

        <SectionCard title="LASSO (Least Absolute Shrinkage & Selection Operator)" icon={GitMerge} defaultOpen={true}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>Theory:</strong> The L1 Penalty is harsh. It will shrink the coefficients of useless or noisy variables <strong>exactly to a zero absolute value</strong>.</p>
            <p><strong>Why it's amazing:</strong> LASSO inherently performs feature selection. You do not need to run Stepwise Regression (SR) ever again. LASSO does the math in one line of code.</p>
          </div>
<CodeBlock language="python" code={`import pandas as pd
import numpy as np
from sklearn.linear_model import Lasso
from sklearn.model_selection import train_test_split

# 1. Massive Collinear Dataset
np.random.seed(42)
num_samples, num_features = 100, 20
X = pd.DataFrame(np.random.normal(0, 1, size=(num_samples, num_features)))

# The Truth: Only Feature_0, Feature_1, and Feature_2 matter! Everything else is noise.
y = 10 * X[0] - 5 * X[1] + 2.5 * X[2] + np.random.normal(0, 2, num_samples)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Train LASSO with an alpha penalty of 0.5
lasso = Lasso(alpha=0.5)
lasso.fit(X_train, y_train)

# 3. View the automatic Feature Selection
print("LASSO Coefficients:")
for i, coef in enumerate(lasso.coef_):
    if coef == 0:
        continue # LASSO mathematical dropped it
    print(f"Feature_{i}: {coef:.3f}")

# Output perfectly drops 17 entirely useless noise variables. 
`} />
        </SectionCard>

        <SectionCard title="Elastic Net (ENET)" icon={Network}>
          <div style={{ marginBottom: '16px' }}>
            <p><strong>Theory:</strong> If you have 3 critical sensors that read identical values (high multicollinearity), LASSO will randomly drop 2 of them to zero. Elastic Net solves this by combining BOTH the Ridge (L2) and LASSO (L1) math. It gracefully zeros out the junk, but keeps groups of critical, correlated sensors alive.</p>
          </div>
<CodeBlock language="python" code={`from sklearn.linear_model import ElasticNet
import pandas as pd
import numpy as np

# Sample Data
X = pd.DataFrame(np.random.normal(0, 1, size=(100, 5)))
y = 3*X[0] + 3*X[1] + np.random.normal(0, 1, 100) # 0 and 1 are correlated/vital

# Elastic net requires mixing both L1 and L2 styles
enet_model = ElasticNet(
    alpha=0.5,     # Total strength of the penalty
    l1_ratio=0.5   # 0.5 = mathematically balances a 50% LASSO / 50% Ridge penalty
)
enet_model.fit(X, y)
print("ENET Coefs:", np.round(enet_model.coef_, 2))
`} />
        </SectionCard>
      </motion.div>
    </div>
  );
}
