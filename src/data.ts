import { ProjectTemplate } from './types';

export const templates: ProjectTemplate[] = [
  {
    id: 'python-fastapi',
    name: 'Python FastAPI Microservice (Python)',
    description: 'A broken Python web app with flake8 indentation errors, unhandled exceptions, and failing pytest cases.',
    language: 'python',
    files: {
      'main.py': `import os
from fastapi import FastAPI, HTTPException
import math # LINT: Unused import

app = FastAPI(title="Autonomous Healing Target")

# SYNTAX ERROR: Missing colon, wrong indentation, and syntax mistake
def calculate_metrics(values)
   sum_vals = sum(values)
  # INDENT ERROR: inconsistent spaces
    count = len(values)
    if count == 0
        return 0
    return sum_vals / count

@app.get("/items/{item_id}")
def read_item(item_id: int):
    # LOGICAL ERROR: Potential division by zero and bad index handling
    mock_db = ["server_config", "agent_module", "database_pool"]
    if item_id < 0 or item_id >= len(mock_db):
        # BUG: This should be item_id, but misspelled as item_idx
        raise HTTPException(status_code=404, detail=f"Item {item_idx} not found")
    
    # TYPE ERROR: trying to add string and list
    data_label = "Item: " + mock_db[item_id]
    return {"id": item_id, "label": data_label}

@app.get("/calculate")
def get_avg(nums: str = ""):
    # LOGICAL BUG: Split by comma but no conversion check, leading to ZeroDivisionError
    num_list = [float(x) for x in nums.split(",") if x.strip() != ""]
    avg = calculate_metrics(num_list)
    return {"average": avg}
`,
      'test_main.py': `import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_item_valid():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json()["label"] == "Item: agent_module"

def test_read_item_invalid():
    # TEST ERROR: Asserts a 404 but due to item_idx bug, it crashes with 500 NameError
    response = client.get("/items/99")
    assert response.status_code == 404

def test_get_avg_empty():
    # TEST ERROR: Empty nums causes division by zero inside calculate_metrics
    response = client.get("/calculate?nums=")
    assert response.status_code == 200
    assert response.json()["average"] == 0
`
    }
  },
  {
    id: 'typescript-node',
    name: 'TypeScript Node API (TypeScript)',
    description: 'A TypeScript repository failing compile checks due to rigid types, missing return statements, and bad configuration.',
    language: 'typescript',
    files: {
      'index.ts': `import express from 'express';
// LINT: Unused import
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());

interface UserConfig {
  id: string;
  name: string;
  isActive: boolean;
  maxWorkers: number;
}

const users: UserConfig[] = [
  { id: "1", name: "Alpha", isActive: true, maxWorkers: 5 },
  { id: "2", name: "Beta", isActive: false, maxWorkers: 2 }
];

// TYPE ERROR: Parameter has implicit 'any' and return type is mismatch
function getUserById(id) {
  const user = users.find(u => u.id === id);
  if (!user) {
    // BUG: Returns a string instead of user or null, breaking return contract
    return "User not found";
  }
  // Missing explicit return if found, returning undefined implicitly
}

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = getUserById(userId);
  
  // LOGICAL ERROR: "user" could be a string "User not found" which is truthy, so this block runs improperly
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

app.post('/users', (req, res) => {
  const payload = req.body;
  
  // TYPE ERROR: Mismatched structure and type conversions
  const newUser: UserConfig = {
    id: String(Date.now()),
    name: payload.name,
    isActive: payload.isActive,
    // TYPE BUG: assigning string value to number
    maxWorkers: payload.maxWorkers || "unlimited"
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

export { app, getUserById };
`,
      'test.ts': `import { getUserById } from './index';

describe('User Retrieval Tests', () => {
  it('should find active user Beta', () => {
    const user = getUserById("2");
    // TEST BUG: user is undefined due to index.ts implicit return bug
    expect(user).toBeDefined();
    expect(user.name).toBe("Beta");
  });

  it('should handle unfound users', () => {
    const user = getUserById("99");
    // TEST BUG: user is returned as a string "User not found" which breaks test logic
    expect(user).toBeNull();
  });
});
`
    }
  },
  {
    id: 'react-app',
    name: 'React SPA Component (React/JSX)',
    description: 'A client-side dashboard failing build compilation with mismatched brackets, wrong prop drilling, and cyclic rendering loops.',
    language: 'react',
    files: {
      'App.tsx': `import React, { useState, useEffect } from 'react';
// LINT: Unused import
import { Layout, Play, RefreshCw } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Resolve pipeline failures", done: false },
    { id: 2, title: "Audit security rules", done: true }
  ]);
  const [filter, setFilter] = useState<string>("all");
  const [syncCount, setSyncCount] = useState<number>(0);

  // SYNTAX ERROR: Mismatched bracket inside effect, and INFINITE LOOP triggering re-renders
  useEffect(() => {
    console.log("Synchronizing tasks...");
    // INFINITE RE-RENDER BUG: Modifies state inside body unconditionally
    setSyncCount(syncCount + 1);
  }, [syncCount]); // Hook dependency causes cyclic execution

  const handleToggle = (id: number) => {
    // LOGICAL BUG: Modifies state directly instead of deep copying or mapping
    const target = tasks.find(t => t.id === id);
    if (target) {
      target.done = !target.done;
      setTasks(tasks); // React won't trigger render because reference is identical
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Task Sync Monitor</h1>
      <div className="space-y-2">
        {tasks.map(task => (
          // SYNTAX BUG: Missing key property, and missing closed brace for handler
          <div key={task.id} className="flex items-center justify-between p-2 border-b">
            <span className={task.done ? 'line-through text-gray-400' : ''}>
              {task.title}
            </span>
            <button 
              onClick={() => handleToggle(task.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              {task.done ? "Undo" : "Complete"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Sync loops completed: {syncCount}
      </div>
    </div>
  );
}
`,
      'App.test.tsx': `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders tasks correctly', () => {
  render(<App />);
  const taskElement = screen.getByText(/Resolve pipeline failures/i);
  expect(taskElement).toBeInTheDocument();
});

test('toggles tasks', () => {
  render(<App />);
  const toggleBtn = screen.getAllByRole('button')[0];
  fireEvent.click(toggleBtn);
  // TEST BUG: Due to handleToggle state mutation bug, components do not re-render and state asserts fail
  expect(screen.getByText(/Resolve pipeline failures/i)).toHaveClass('line-through');
});
`
    }
  },
  {
    id: 'java-maven',
    name: 'Java Maven Microservice (Java)',
    description: 'A broken Java core service with missing semicolons, improper return types, dangerous division by zero, and unhandled null exceptions.',
    language: 'java',
    files: {
      'Calculator.java': `package com.healing;

public class Calculator {
    // SYNTAX ERROR: missing semicolon and wrong return type definition
    public int add(int a, int b) {
        return a + b
    }

    public double divide(double a, double b) {
        // LOGICAL ERROR: Division by zero without validation returning Infinity
        return a / b;
    }

    public String getStatus(String code) {
        // TYPE/RUNTIME ERROR: Potential NullPointerException if code is null
        if (code.equals("active")) {
            return "ACTIVE";
        }
        return "INACTIVE";
    }
}
`,
      'CalculatorTest.java': `package com.healing;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    @Test
    public void testAdd() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    public void testDivideZero() {
        Calculator calc = new Calculator();
        // TEST ERROR: Expects 0.0, but division by zero in floating point returns Infinity
        assertEquals(0.0, calc.divide(5.0, 0.0));
    }

    @Test
    public void testGetStatusNull() {
        Calculator calc = new Calculator();
        // TEST ERROR: throws NullPointerException on code.equals()
        assertNull(calc.getStatus(null));
    }
}
`
    }
  },
  {
    id: 'c-app',
    name: 'C System Utility (C)',
    description: 'A system utility in C with buffer overflow vulnerabilities, missing semicolons, and uninitialized command argument handling.',
    language: 'c',
    files: {
      'main.c': `#include <stdio.h>
#include <string.h>

// SYNTAX ERROR: missing return type, missing semicolon
process_buffer(char *input) {
    char buffer[16];
    // LOGICAL ERROR: dangerous buffer overflow (unsafe strcpy)
    strcpy(buffer, input)
    printf("Processed: %s\\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        // LOGICAL BUG: Dereferencing argv[1] if not checked properly
        printf("Usage: %s <input>\\n", argv[0]);
    }
    process_buffer(argv[1]);
    return 0;
}
`,
      'test.c': `#include <assert.h>
#include <string.h>
#include <stdio.h>

extern int process_buffer(char *input);

void test_safe_input() {
    process_buffer("hello");
}

void test_unsafe_input() {
    // TEST ERROR: overflows buffer, causing segmentation fault or stack smashing
    process_buffer("this_input_is_way_too_long_for_sixteen_bytes");
}

int main() {
    test_safe_input();
    test_unsafe_input();
    printf("All C unit tests passed.\\n");
    return 0;
}
`
    }
  },
  {
    id: 'cpp-app',
    name: 'C++ Data Analyzer (C++)',
    description: 'An object-oriented C++ app failing to build due to missing namespace references, memory allocations, and out-of-bounds vector access.',
    language: 'cpp',
    files: {
      'analyzer.cpp': `#include <iostream>
#include <vector>
#include <numeric>

// SYNTAX ERROR: missing namespace std qualification
class DataAnalyzer {
private:
    std::vector<double> dataset;

public:
    DataAnalyzer(std::vector<double> data) {
        dataset = data;
    }

    double getMean() {
        // LOGICAL BUG: division by zero if dataset is empty
        double sum = std::accumulate(dataset.begin(), dataset.end(), 0.0);
        return sum / dataset.size();
    }

    double getElementAt(int index) {
        // LOGICAL BUG: unsafe bounds access, missing semicolon
        return dataset[index]
    }
};
`,
      'test.cpp': `#include <iostream>
#include <vector>
#include <cassert>
#include "analyzer.cpp"

int main() {
    std::vector<double> empty_data;
    DataAnalyzer analyzer1(empty_data);
    // TEST ERROR: Division by zero returns NaN, assert fails
    assert(analyzer1.getMean() == 0.0);

    std::vector<double> valid_data = {10.0, 20.0, 30.0};
    DataAnalyzer analyzer2(valid_data);
    // TEST ERROR: out of bounds access causes undefined behavior or crash
    assert(analyzer2.getElementAt(5) == 0.0);

    std::cout << "All C++ tests verified." << std::endl;
    return 0;
}
`
    }
  },
  {
    id: 'go-api',
    name: 'Go Microservice (Go)',
    description: 'A Go microservice with nil-pointer dereferences, missing return types, and unhandled errors.',
    language: 'go',
    files: {
      'main.go': `#include <stdio.h> // LINT: C-style header in Go

package main

import (
    "fmt"
)

type Config struct {
    Version string
}

var cfg *Config // nil pointer by default

func getVersion() (string, error) {
    // LOGICAL BUG: Nil pointer dereference because cfg is never initialized
    return cfg.Version, nil
}

// SYNTAX ERROR: missing return parameters list
func divide(a, b float64) {
    if b == 0 {
        // LOGICAL BUG: returning zero instead of error
        return 0, nil
    }
    return a / b, nil
}

func main() {
    fmt.Println("Starting autonomous Go healing service...")
}
`,
      'main_test.go': `package main

import "testing"

func TestGetVersion(t *testing.T) {
    _, err := getVersion()
    // TEST ERROR: crashes due to nil pointer dereference
    if err != nil {
        t.Errorf("Expected no error, got %v", err)
    }
}

func TestDivide(t *testing.T) {
    _, err := divide(10, 0)
    // TEST ERROR: returns 0, nil so err is nil, asserting error fails
    if err == nil {
        t.Error("Expected error when dividing by zero, got nil")
    }
}
`
    }
  }
];
