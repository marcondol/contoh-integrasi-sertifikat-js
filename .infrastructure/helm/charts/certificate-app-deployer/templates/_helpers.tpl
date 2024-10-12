{{/*
Expand the name of the chart.
*/}}
{{- define "certificate-app-deployer.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "certificate-app-deployer.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "certificate-app-deployer.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "certificate-app-deployer.labels" -}}
helm.sh/chart: {{ include "certificate-app-deployer.chart" . }}
{{ include "certificate-app-deployer.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "certificate-app-deployer.selectorLabels" -}}
app.kubernetes.io/name: {{ include "certificate-app-deployer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "certificate-app-deployer.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "certificate-app-deployer.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of secret.
*/}}
{{- define "certificate-app-deployer.secretName" -}}
{{- printf "%s-%s" (include "certificate-app-deployer.fullname" .) "secrets" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "certificate-app-deployer.secretHelper"}}
{{- if .Values.config.secretsSnippet -}}
{{- range $line := splitList "\n" .Values.config.secretsSnippet -}}
{{- $parts := regexSplit "=" . 2  }}
- name: {{ index $parts 0 }}
  valueFrom:
    secretKeyRef:
      name: {{ include "certificate-app-deployer.secretName" $ }}
      key: {{ index $parts 0 }}
{{- end -}}
{{- end -}}
{{- end -}}
