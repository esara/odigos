/*
Copyright 2022.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// Code generated by applyconfiguration-gen. DO NOT EDIT.

package v1alpha1

import (
	instrumentationrules "github.com/odigos-io/odigos/api/odigos/v1alpha1/instrumentationrules"
	workload "github.com/odigos-io/odigos/k8sutils/pkg/workload"
)

// InstrumentationRuleSpecApplyConfiguration represents a declarative configuration of the InstrumentationRuleSpec type for use
// with apply.
type InstrumentationRuleSpecApplyConfiguration struct {
	RuleName                 *string                                             `json:"ruleName,omitempty"`
	Notes                    *string                                             `json:"notes,omitempty"`
	Disabled                 *bool                                               `json:"disabled,omitempty"`
	Workloads                *[]workload.PodWorkload                             `json:"workloads,omitempty"`
	InstrumentationLibraries *[]InstrumentationLibraryGlobalIdApplyConfiguration `json:"instrumentationLibraries,omitempty"`
	PayloadCollection        *instrumentationrules.PayloadCollection             `json:"payloadCollection,omitempty"`
}

// InstrumentationRuleSpecApplyConfiguration constructs a declarative configuration of the InstrumentationRuleSpec type for use with
// apply.
func InstrumentationRuleSpec() *InstrumentationRuleSpecApplyConfiguration {
	return &InstrumentationRuleSpecApplyConfiguration{}
}

// WithRuleName sets the RuleName field in the declarative configuration to the given value
// and returns the receiver, so that objects can be built by chaining "With" function invocations.
// If called multiple times, the RuleName field is set to the value of the last call.
func (b *InstrumentationRuleSpecApplyConfiguration) WithRuleName(value string) *InstrumentationRuleSpecApplyConfiguration {
	b.RuleName = &value
	return b
}

// WithNotes sets the Notes field in the declarative configuration to the given value
// and returns the receiver, so that objects can be built by chaining "With" function invocations.
// If called multiple times, the Notes field is set to the value of the last call.
func (b *InstrumentationRuleSpecApplyConfiguration) WithNotes(value string) *InstrumentationRuleSpecApplyConfiguration {
	b.Notes = &value
	return b
}

// WithDisabled sets the Disabled field in the declarative configuration to the given value
// and returns the receiver, so that objects can be built by chaining "With" function invocations.
// If called multiple times, the Disabled field is set to the value of the last call.
func (b *InstrumentationRuleSpecApplyConfiguration) WithDisabled(value bool) *InstrumentationRuleSpecApplyConfiguration {
	b.Disabled = &value
	return b
}

// WithWorkloads sets the Workloads field in the declarative configuration to the given value
// and returns the receiver, so that objects can be built by chaining "With" function invocations.
// If called multiple times, the Workloads field is set to the value of the last call.
func (b *InstrumentationRuleSpecApplyConfiguration) WithWorkloads(value []workload.PodWorkload) *InstrumentationRuleSpecApplyConfiguration {
	b.Workloads = &value
	return b
}

func (b *InstrumentationRuleSpecApplyConfiguration) ensureInstrumentationLibraryGlobalIdApplyConfigurationExists() {
	if b.InstrumentationLibraries == nil {
		b.InstrumentationLibraries = &[]InstrumentationLibraryGlobalIdApplyConfiguration{}
	}
}

// WithInstrumentationLibraries adds the given value to the InstrumentationLibraries field in the declarative configuration
// and returns the receiver, so that objects can be build by chaining "With" function invocations.
// If called multiple times, values provided by each call will be appended to the InstrumentationLibraries field.
func (b *InstrumentationRuleSpecApplyConfiguration) WithInstrumentationLibraries(values ...*InstrumentationLibraryGlobalIdApplyConfiguration) *InstrumentationRuleSpecApplyConfiguration {
	b.ensureInstrumentationLibraryGlobalIdApplyConfigurationExists()
	for i := range values {
		if values[i] == nil {
			panic("nil value passed to WithInstrumentationLibraries")
		}
		*b.InstrumentationLibraries = append(*b.InstrumentationLibraries, *values[i])
	}
	return b
}

// WithPayloadCollection sets the PayloadCollection field in the declarative configuration to the given value
// and returns the receiver, so that objects can be built by chaining "With" function invocations.
// If called multiple times, the PayloadCollection field is set to the value of the last call.
func (b *InstrumentationRuleSpecApplyConfiguration) WithPayloadCollection(value instrumentationrules.PayloadCollection) *InstrumentationRuleSpecApplyConfiguration {
	b.PayloadCollection = &value
	return b
}